pub mod utils;

extern crate wasm_bindgen;
use utils::{render_error, ColorTerminal, Repository, StringWrite, VecReader, ELLIE_CORE};
use wasm_bindgen::prelude::*;

use std::{
    panic,
    sync::{mpsc, Arc, Mutex},
};
use web_time::SystemTime;

use ellie_engine::{
    compiler,
    ellie_bytecode::{self, assembler},
    ellie_core::defs::{DebugHeader, DebugInfo, PlatformArchitecture, Version},
    ellie_fmt::fmt::{Formatter, FormatterOptions},
    ellie_parser::parser::Module,
    ellie_renderer_utils::utils::{print_errors, print_warnings, ColorDisplay, Colors},
    ellie_vm::{
        channel::{EllieModule, FunctionElement, ModuleElements, ModuleManager},
        program::{Program, VmProgram},
        raw_type::StaticRawType,
        thread::{Isolate, Thread},
        utils::{ProgramReader, StepResult, ThreadExit, VmNativeAnswer, VmNativeCallParameters},
    },
    engine_constants, tokenizer,
    utils::CompilerSettings,
    vm::{parse_debug_file, RFile},
};
#[macro_use]
extern crate lazy_static;
extern crate wee_alloc;

use crate::utils::render_warning;
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

#[wasm_bindgen]
pub fn init() {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
}

#[wasm_bindgen]
pub struct CompileResult {
    program: js_sys::Uint8Array,
    debug_file: String,
}

#[wasm_bindgen]
impl CompileResult {
    #[wasm_bindgen(constructor)]
    pub fn new(program: js_sys::Uint8Array, debug_file: String) -> CompileResult {
        CompileResult {
            program,
            debug_file,
        }
    }

    #[wasm_bindgen(getter)]
    pub fn program(&self) -> js_sys::Uint8Array {
        self.program.clone()
    }

    #[wasm_bindgen(setter)]
    pub fn set_program(&mut self, program: js_sys::Uint8Array) {
        self.program = program;
    }

    #[wasm_bindgen(getter)]
    pub fn debug_file(&self) -> String {
        self.debug_file.clone()
    }

    #[wasm_bindgen(setter)]
    pub fn set_debug_file(&mut self, debug_file: String) {
        self.debug_file = debug_file;
    }
}

#[wasm_bindgen(js_name = "byteCodeGenerate")]
pub fn byte_code_generate(stdout: JsValue, codec: &str) -> Option<String> {
    let (sender, receiver) = mpsc::channel();
    let sender = Arc::new(Mutex::new(sender));
    let receiver = Arc::new(Mutex::new(receiver));

    {
        let js_function = js_sys::Function::from(stdout);
        let callback = move |message: String| {
            js_function
                .call1(&JsValue::null(), &JsValue::from_str(&message))
                .unwrap();
        };

        let receiver_clone = receiver.clone();
        wasm_bindgen_futures::spawn_local(async move {
            while let Ok(message) = receiver_clone.lock().unwrap().recv() {
                callback(message);
            }
        });
    }

    let send_message_to_js = |message_type: &str, message: String| {
        let new_message = message
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
            .replace("\t", "\\t");
        if sender
            .lock()
            .unwrap()
            .send(format!(
                "{{\"type\": \"{message_type}\",\"message\": \"{new_message}\"}}",
            ))
            .is_err()
        {
            log!("Failed to send message to js, maybe the channel has been closed.");
        }
    };

    let eib = match serde_json::from_str::<Module>(&ELLIE_CORE) {
        Ok(e) => e,
        Err(e) => {
            send_message_to_js(
                "error",
                format!("Failed to import ellie core module: {}", e),
            );
            return None;
        }
    };

    let color_terminal = ColorTerminal;

    let mut program_repository = Repository {
        code: codec.to_string(),
        main_hash: 0,
    };
    match tokenizer::tokenize_file(&mut program_repository) {
        Ok(pages) => {
            match compiler::parse_pages(
                program_repository.main_hash,
                vec![(eib, None)],
                pages,
                CompilerSettings {
                    name: "playground".to_string(),
                    file_name: String::from("playground.ei"),
                    is_lib: false,
                    description: String::from("No description"),
                    experimental_features: false,
                    byte_code_architecture: PlatformArchitecture::B32,
                    version: Version::build_from_string(&"0.1.0".to_string()),
                },
            ) {
                Ok(compile_output) => {
                    if !compile_output.warnings.is_empty() {
                        send_message_to_js(
                            "warning_display",
                            print_warnings(
                                &compile_output.warnings,
                                |_| codec.to_string().replace("\t", "    "),
                                |_| "ellie_playground".to_string(),
                                color_terminal,
                            ),
                        );
                        for warning in compile_output.warnings {
                            send_message_to_js("warning_display", render_warning(warning));
                        }
                    }

                    //let bytecode_start = Instant::now();
                    let mut assembler = assembler::Assembler::new(
                        compile_output.module,
                        ellie_bytecode::assembler::PlatformAttributes {
                            architecture: PlatformArchitecture::B32,
                            memory_size: 11,
                        },
                    );
                    let assembler_result = assembler.assemble(Vec::new());
                    let mut string_reader = StringWrite::new();

                    assembler_result.alternate_render(&mut string_reader);
                    Some(string_reader.data.clone())
                }
                Err(errors) => {
                    log!("compile error");

                    send_message_to_js(
                        "error_display",
                        print_errors(
                            &errors,
                            |_| codec.to_string().replace("\t", "    "),
                            false,
                            |_| "ellie_playground".to_string(),
                            color_terminal,
                        ),
                    );
                    for error in &errors {
                        send_message_to_js("error_display", render_error(error.clone()));
                    }
                    None
                }
            }
        }
        Err(pager_errors) => {
            send_message_to_js(
                "error_display",
                print_errors(
                    &pager_errors,
                    |_| codec.to_string().replace("\t", "    "),
                    false,
                    |_| "ellie_playground".to_string(),
                    color_terminal,
                ),
            );
            for error in &pager_errors {
                send_message_to_js("error_display", render_error(error.clone()));
            }
            None
        }
    }
}

#[wasm_bindgen(js_name = "formatCode")]
pub fn format_code(stdout: JsValue, codec: &str) -> Option<String> {
    let (sender, receiver) = mpsc::channel();
    let sender = Arc::new(Mutex::new(sender));
    let receiver = Arc::new(Mutex::new(receiver));

    {
        let js_function = js_sys::Function::from(stdout);
        let callback = move |message: String| {
            js_function
                .call1(&JsValue::null(), &JsValue::from_str(&message))
                .unwrap();
        };

        let receiver_clone = receiver.clone();
        wasm_bindgen_futures::spawn_local(async move {
            while let Ok(message) = receiver_clone.lock().unwrap().recv() {
                callback(message);
            }
        });
    }

    let send_message_to_js = |message_type: &str, message: String| {
        let new_message = message
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
            .replace("\t", "\\t");
        if sender
            .lock()
            .unwrap()
            .send(format!(
                "{{\"type\": \"{message_type}\",\"message\": \"{new_message}\"}}",
            ))
            .is_err()
        {
            log!("Failed to send message to js, maybe the channel has been closed.");
        }
    };

    let color_terminal = ColorTerminal;

    let mut program_repository = Repository {
        code: codec.to_string(),
        main_hash: 0,
    };
    match tokenizer::tokenize_file(&mut program_repository) {
        Ok(pages) => {
            let formatter = Formatter::new(FormatterOptions {
                render_brace_next_line: false,
                use_tabs: true,
                ..Default::default()
            });
            Some(formatter.format_page(&pages[0]))
        }
        Err(pager_errors) => {
            send_message_to_js(
                "error_display",
                print_errors(
                    &pager_errors,
                    |_| codec.to_string().replace("\t", "    "),
                    false,
                    |_| "ellie_playground".to_string(),
                    color_terminal,
                ),
            );
            for error in &pager_errors {
                send_message_to_js("error_display", render_error(error.clone()));
            }
            None
        }
    }
}

#[wasm_bindgen]
pub fn compile(stdout: JsValue, codec: &str) -> Option<CompileResult> {
    let (sender, receiver) = mpsc::channel();
    let sender = Arc::new(Mutex::new(sender));
    let receiver = Arc::new(Mutex::new(receiver));

    {
        let js_function = js_sys::Function::from(stdout);
        let callback = move |message: String| {
            js_function
                .call1(&JsValue::null(), &JsValue::from_str(&message))
                .unwrap();
        };

        let receiver_clone = receiver.clone();
        wasm_bindgen_futures::spawn_local(async move {
            while let Ok(message) = receiver_clone.lock().unwrap().recv() {
                callback(message);
            }
        });
    }

    let send_message_to_js = |message_type: &str, message: String| {
        let new_message = message
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
            .replace("\t", "\\t");
        if sender
            .lock()
            .unwrap()
            .send(format!(
                "{{\"type\": \"{message_type}\",\"message\": \"{new_message}\"}}",
            ))
            .is_err()
        {
            log!("Failed to send message to js, maybe the channel has been closed.");
        }
    };

    let eib = match serde_json::from_str::<Module>(&ELLIE_CORE) {
        Ok(e) => e,
        Err(e) => {
            send_message_to_js(
                "error",
                format!("Failed to import ellie core module: {}", e),
            );
            return None;
        }
    };

    let color_terminal = ColorTerminal;

    let mut program_repository = Repository {
        code: codec.to_string(),
        main_hash: 0,
    };
    match tokenizer::tokenize_file(&mut program_repository) {
        Ok(pages) => {
            match compiler::parse_pages(
                program_repository.main_hash,
                vec![(eib, None)],
                pages,
                CompilerSettings {
                    name: "playground".to_string(),
                    file_name: String::from("playground.ei"),
                    is_lib: false,
                    description: String::from("No description"),
                    experimental_features: false,
                    byte_code_architecture: PlatformArchitecture::B32,
                    version: Version::build_from_string(&"0.1.0".to_string()),
                },
            ) {
                Ok(compile_output) => {
                    if !compile_output.warnings.is_empty() {
                        send_message_to_js(
                            "warning_display",
                            print_warnings(
                                &compile_output.warnings,
                                |_| codec.to_string().replace("\t", "    "),
                                |_| "ellie_playground".to_string(),
                                color_terminal,
                            ),
                        );
                        for warning in compile_output.warnings {
                            send_message_to_js("warning_display", render_warning(warning));
                        }
                    }

                    //let bytecode_start = Instant::now();
                    let mut assembler = assembler::Assembler::new(
                        compile_output.module,
                        ellie_bytecode::assembler::PlatformAttributes {
                            architecture: PlatformArchitecture::B32,
                            memory_size: 11,
                        },
                    );
                    let assembler_result = assembler.assemble(Vec::new());

                    let mut data_vec = Vec::new();
                    let mut vec_reader = VecReader::new(&mut data_vec);
                    let mut string_reader = StringWrite::new();

                    assembler_result.render_binary(&mut vec_reader, &mut string_reader);
                    Some(CompileResult {
                        program: js_sys::Uint8Array::from(&data_vec[..]),
                        debug_file: string_reader.data.clone(),
                    })
                }
                Err(errors) => {
                    send_message_to_js(
                        "error_display",
                        print_errors(
                            &errors,
                            |_| codec.to_string().replace("\t", "    "),
                            false,
                            |_| "ellie_playground".to_string(),
                            color_terminal,
                        ),
                    );
                    for error in &errors {
                        send_message_to_js("error_display", render_error(error.clone()));
                    }
                    None
                }
            }
        }
        Err(pager_errors) => {
            send_message_to_js(
                "error_display",
                print_errors(
                    &pager_errors,
                    |_| codec.to_string().replace("\t", "    "),
                    false,
                    |_| "ellie_playground".to_string(),
                    color_terminal,
                ),
            );
            for error in &pager_errors {
                send_message_to_js("error_display", render_error(error.clone()));
            }
            None
        }
    }
}

#[wasm_bindgen]
pub fn run(stdout: JsValue, js_objects: js_sys::Uint8Array, debug_file: String) {
    let data_vec: Vec<u8> = js_objects.to_vec();
    let (sender, receiver) = mpsc::channel::<String>();
    let sender = Arc::new(Mutex::new(sender));
    let receiver = Arc::new(Mutex::new(receiver));
    let color_terminal = ColorTerminal;

    let debug_file = match parse_debug_file(debug_file) {
        Ok(e) => Some(e),
        Err(e) => {
            log!(
                "{}Error:{} {}",
                color_terminal.color(Colors::Red),
                color_terminal.color(Colors::Reset),
                e
            );
            None
        }
    };

    {
        let js_function = js_sys::Function::from(stdout);
        let callback = move |message: String| {
            js_function
                .call1(&JsValue::null(), &JsValue::from_str(&message))
                .unwrap();
        };

        let receiver_clone = receiver.clone();
        wasm_bindgen_futures::spawn_local(async move {
            while let Ok(message) = receiver_clone.lock().unwrap().recv() {
                callback(message);
            }
        });
    }

    let send_message_to_js = |message_type: &str, message: String| {
        let new_message = message
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
            .replace("\t", "\\t");
        if sender
            .lock()
            .unwrap()
            .send(format!(
                "{{\"type\": \"{message_type}\",\"message\": \"{new_message}\"}}",
            ))
            .is_err()
        {
            log!("Failed to send message to js, maybe the channel has been closed.");
        }
    };

    let mut data_clone = data_vec.clone();

    let mut vec_reader = VecReader::new(&mut data_clone);
    let mut reader = RFile::new(&mut vec_reader);
    let mut program_reader = ProgramReader::new(&mut reader);
    let mut program = Program::new();
    let program: Program = match program.build_from_reader(&mut program_reader) {
        Ok(_) => program,
        Err(e) => {
            panic!(
                "{}Error:{} Failed to read program {}[{:?}]{}",
                color_terminal.color(Colors::Red),
                color_terminal.color(Colors::Reset),
                color_terminal.color(Colors::Cyan),
                e,
                color_terminal.color(Colors::Reset)
            );
        }
    };

    let mut ellie_core_module = EllieModule::new("ellieCore".to_string());
    let sender_clone = sender.clone();
    ellie_core_module.register_element(ModuleElements::Function(FunctionElement::new(
        "println",
        Box::new(move |_, args| {
            if args.len() != 1 {
                return VmNativeAnswer::RuntimeError(
                    "Signature mismatch expected 1 argument(s)".to_string(),
                );
            }
            match &args[0] {
                VmNativeCallParameters::Static(_) => VmNativeAnswer::RuntimeError(
                    "Signature mismatch expected 'dynamic' argument".to_string(),
                ),
                VmNativeCallParameters::Dynamic(dynamic_value) => {
                    if dynamic_value.is_string() {
                        let _send_message_to_js = |message_type: &str, message: String| {
                            let new_message = message
                                .replace("\"", "\\\"")
                                .replace("\n", "\\n")
                                .replace("\r", "\\r")
                                .replace("\t", "\\t");
                            if sender_clone.lock().unwrap().send(format!(
                                "{{\"type\": \"{message_type}\",\"message\": \"{new_message}\"}}",
                            )) .is_err()
                            {
                                log!("Failed to send message to js, maybe the channel has been closed.");
                            }
                        };
                        log!("info: {}", dynamic_value.to_string());
                        _send_message_to_js("info", dynamic_value.to_string());
                        VmNativeAnswer::Ok(VmNativeCallParameters::Static(
                            StaticRawType::from_void(),
                        ))
                    } else {
                        VmNativeAnswer::RuntimeError(
                            "Signature mismatch expected 'string' argument".to_string(),
                        )
                    }
                }
            }
        }),
    )));

    ellie_core_module.register_element(ModuleElements::Function(FunctionElement::new(
        "timestamp",
        Box::new(|_, args| {
            if !args.is_empty() {
                return VmNativeAnswer::RuntimeError(
                    "Signature mismatch expected 0 argument(s)".to_string(),
                );
            }
            VmNativeAnswer::Ok(VmNativeCallParameters::Static(StaticRawType::from_int(
                SystemTime::now()
                    .duration_since(SystemTime::UNIX_EPOCH)
                    .unwrap()
                    .as_secs() as isize,
            )))
        }),
    )));

    let mut module_manager = ModuleManager::new();

    module_manager.register_module(ellie_core_module);
    let mut vm_program: VmProgram = VmProgram::new();

    vm_program.fill_from_vector(program.instructions);
    vm_program.fill_traces(program.native_call_traces.clone());

    let isolate = Isolate::new();
    let mut thread = Thread::new(program.main.hash, PlatformArchitecture::B32, isolate);
    thread.build_thread(program.main.clone());

    let mut i = 0;
    loop {
        match thread.step(&mut module_manager, &vm_program) {
            StepResult::Step => {
                i += 1;
                if i > 100_000_000 {
                    send_message_to_js(
                        "info",
                        format!(
                            "{}[VM]{}: Execution canceled, over {}100_000_000{} cycles has passed.\n\n",
                            color_terminal.color(Colors::Yellow),
                            color_terminal.color(Colors::Reset),
                            color_terminal.color(Colors::Red),
                            color_terminal.color(Colors::Reset),
                        ),
                    );
                    send_message_to_js(
                        "info",
                        format!(
                            "{}[:)]{}: Try it on real machine :)\n\n",
                            color_terminal.color(Colors::Red),
                            color_terminal.color(Colors::Reset),
                        ),
                    );
                    break;
                }
            }
            StepResult::ThreadExit(thread_exit) => match thread_exit {
                ThreadExit::ExitGracefully => {
                    send_message_to_js(
                        "info",
                        format!(
                            "{}[VM]{}: Exited Gracefully with {}'{i}'{} cycles \n\n",
                            color_terminal.color(Colors::Yellow),
                            color_terminal.color(Colors::Reset),
                            color_terminal.color(Colors::Green),
                            color_terminal.color(Colors::Reset),
                        ),
                    );
                    break;
                }
                ThreadExit::Panic(panic) => {
                    send_message_to_js(
                        "log",
                        format!(
                            "\n{}ThreadPanic{} : {}{:?}{}",
                            color_terminal.color(Colors::Red),
                            color_terminal.color(Colors::Reset),
                            color_terminal.color(Colors::Cyan),
                            panic.reason,
                            color_terminal.color(Colors::Reset),
                        ),
                    );
                    for frame in panic.stack_trace {
                        match &debug_file {
                            Some(debug_file) => {
                                let coresponding_header =
                                    debug_file.debug_headers.iter().find(|x| {
                                        frame.pos >= x.start_end.0 && frame.pos <= x.start_end.1
                                    });

                                match coresponding_header {
                                    Some(e) => {
                                        fn get_real_path(
                                            debug_header: &DebugHeader,
                                            debug_file: &DebugInfo,
                                        ) -> String {
                                            let module_name = debug_header
                                                .module_name
                                                .split("<ellie_module_")
                                                .nth(1)
                                                .unwrap()
                                                .split(">")
                                                .nth(0)
                                                .unwrap();
                                            let module_path = debug_file
                                                .module_map
                                                .iter()
                                                .find(|map| module_name == map.module_name);
                                            let real_path = match module_path {
                                                Some(module_path) => match &module_path.module_path
                                                {
                                                    Some(module_path) => {
                                                        let new_path =
                                                            debug_header.module_name.clone();
                                                        let starter_name = format!(
                                                            "<ellie_module_{}>",
                                                            module_name
                                                        );
                                                        new_path
                                                            .replace(&starter_name, &module_path)
                                                    }
                                                    None => debug_header.module_name.clone(),
                                                },
                                                None => debug_header.module_name.clone(),
                                            };
                                            real_path
                                        }

                                        let real_path = get_real_path(e, debug_file);

                                        send_message_to_js(
                                            "log",
                                            format!(
                                                "{}    at {}:{}:{}",
                                                color_terminal.color(Colors::Green),
                                                real_path,
                                                e.pos.range_start.0 + 1,
                                                e.pos.range_start.1 + 1,
                                            ),
                                        );
                                    }
                                    None => {
                                        send_message_to_js(
                                            "log",
                                            format!(
                                                "{}    at {}:{}",
                                                color_terminal.color(Colors::Green),
                                                "frame.name",
                                                frame.pos
                                            ),
                                        );
                                    }
                                }
                            }
                            None => {
                                send_message_to_js(
                                    "log",
                                    format!(
                                        "{}    at {}:{} ({} + {})",
                                        color_terminal.color(Colors::Green),
                                        "frame.name",
                                        frame.pos + frame.frame_pos,
                                        frame.pos,
                                        frame.frame_pos,
                                    ),
                                );
                            }
                        }
                    }
                    if debug_file.is_none() {
                        send_message_to_js("log", format!(
                                   "\n{}NoDebugFile{} : {}Given error represents stack locations, provide a debug info file to get more readable info{}",
                                   color_terminal.color(Colors::Yellow),
                                   color_terminal.color(Colors::Reset),
                                   color_terminal.color(Colors::Cyan),
                                   color_terminal.color(Colors::Reset),
                               ));
                    }
                    break;
                }
            },
        }
    }
}

#[wasm_bindgen(js_name = "getInfo")]
pub fn get_info() -> String {
    let color_terminal = ColorTerminal;
    format!(
        "Ellie v{} ({})\nBuild Info: ({}: {}){}\n\nBytecode Version: v{}\nTokenizer Version: v{}\nParser Version: v{}\nCore version: v{}\nVM version: v{}",
        engine_constants::ELLIE_ENGINE_VERSION,
        engine_constants::ELLIE_ENGINE_VERSION_NAME,
        engine_constants::ELLIE_BUILD_GIT_HASH,
        engine_constants::ELLIE_BUILD_DATE,
        if engine_constants::ELLIE_BUILD_GIT_BRANCH != "main" {
            format!(
                " [{}{}{}] ",
                color_terminal.color(Colors::Yellow),
                engine_constants::ELLIE_BUILD_GIT_BRANCH,
                color_terminal.color(Colors::Reset)
            )
        } else {
            String::new()
        },
        engine_constants::ELLIE_BYTECODE_VERSION,
        engine_constants::ELLIE_TOKENIZER_VERSION,
        engine_constants::ELLIE_PARSER_VERSION,
        engine_constants::ELLIE_CORE_VERSION,
        engine_constants::ELLIE_VM_VERSION
    )
}
