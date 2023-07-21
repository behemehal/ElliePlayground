extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

use std::{
    collections::hash_map::DefaultHasher,
    hash::{Hash, Hasher},
};

use ellie_engine::{
    compiler,
    ellie_bytecode::{self, assembler},
    ellie_renderer_utils::utils::{print_errors, print_warnings, ColorDisplay, Colors, TextStyles},
    ellie_tokenizer::tokenizer::ResolvedImport,
    ellie_vm::{self, utils::Reader},
    tokenizer,
    utils::{CompilerSettings, MainProgram, ProgramRepository},
    vm::read_program, ellie_parser::parser::Module,
};

extern crate wee_alloc;
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

static HOST_FILE: &'static [u8] = include_bytes!("../lib.eib");


#[wasm_bindgen]
pub fn run(codec: &str) {
    let window = web_sys::window().expect("no global `window` exists");
    let document = window.document().expect("should have a document on window");
    let stdout = document.get_element_by_id("container_right_up").unwrap();
    let errout = document.get_element_by_id("errout").unwrap();

    

    let code = format!(
        "
        @dont_fix_variant;
        pub class bool {{}}
        
        @dont_fix_variant;
        pub class string {{}}
        
        @dont_fix_variant;
        pub class char {{}}
        
        @dont_fix_variant;
        pub class int {{}}
        
        @dont_fix_variant;
        pub class float {{}}

        @dont_fix_variant;
        pub class double {{}}

        @dont_fix_variant;
        pub class void {{}}

        @dont_fix_variant;
        pub class null {{}}

        @dont_fix_variant;
        pub class function {{}}

        @dont_fix_variant;
        pub class object {{}}

        @ellie_deep_cast=true;
        c true : bool = 1 as bool;
        @ellie_deep_cast=false;
        c false : bool = 0 as bool;

        pub fn println(s: string);
        //pub fn panic(s: string);

        /// Ellie Standard Library end
        /// This is not a legit import, but it is used to test the wasm


        {}",
        codec
    );

    let render_error = |error: &ellie_core::error::Error| {
        let error_text = format!("{{\"message_type\": \"error\",\"message\": \"{}\",\"range_start\": [{}, {}],\"range_end\": [{}, {}], \"reference\": {}}}",
            error.builded_message.builded.replace("\"", "\\\""),
            error.pos.range_start.0 - 42,
            error.pos.range_start.1 - 1,
            error.pos.range_start.0 - 42,
            error.pos.range_end.1 - 1,
            if let Some(reference) = &error.reference_block {
                format!("{{\"message\": {} \"range_start\": [{}, {}],\"range_end\": [{}, {}]}}", error.reference_message.replace("\"", "\\\""), reference.0.range_start.0, reference.0.range_start.1 - 1,reference.0.range_end.0,reference.0.range_end.1 - 1,)
            } else {
                "false".to_string()
            }
        );
        let new_element = document.create_element("div").unwrap();
        new_element.set_text_content(Some(&error_text));
        errout.append_child(&new_element).unwrap();
    };

    let render_warning = |warning: &ellie_core::warning::Warning| {
        let warning_text = format!("{{\"message_type\": \"warning\",\"message\": \"{}\",\"range_start\": [{}, {}],\"range_end\": [{}, {}], \"reference\": {}}}",
            warning.builded_message.builded.replace("\"", "\\\""),
            warning.pos.range_start.0 - 42,
            warning.pos.range_start.1 - 1,
            warning.pos.range_start.0 - 42,
            warning.pos.range_end.1 - 1,
            if let Some(reference) = &warning.reference_block {
                format!("{{\"message\": {} \"range_start\": [{}, {}],\"range_end\": [{}, {}]}}", warning.reference_message.replace("\"", "\\\""), reference.0.range_start.0, reference.0.range_start.1 - 1,reference.0.range_end.0,reference.0.range_end.1 - 1,)
            } else {
                "false".to_string()
            }
        );
        let new_element = document.create_element("div").unwrap();
        new_element.set_text_content(Some(&warning_text));
        errout.append_child(&new_element).unwrap();
    };

   

    let stdout_write_text = |text: &str| {
        let new_element = document.create_element("div").unwrap();
        new_element.set_text_content(Some(text));
        stdout.append_child(&new_element).unwrap();
    };

    let stdout_write_element = |text: &str| {
        let new_element = document.create_element("div").unwrap();
        new_element.set_inner_html(text);
        stdout.append_child(&new_element).unwrap();
    };

    let eib = match bincode::deserialize::<Module>(HOST_FILE) {
        Ok(e) => e,
        Err(e) => {
            stdout_write_element(&format!("{{\"message_type\": \"error\",\"message\": \"{}\"}}", e));
            panic!("Failed to deserialize host file: {:?}", e);
        },
    };

    #[derive(Copy, Clone)]
    struct ColorTerminal;

    let color_terminal = ColorTerminal;

    impl ColorDisplay for ColorTerminal {
        fn color(&self, color: Colors) -> String {
            let color_id = match color {
                Colors::Black => "<span class=\"termBlack\">",
                Colors::Red => "<span class=\"termRed\">",
                Colors::Green => "<span class=\"termGreen\">",
                Colors::Yellow => "<span class=\"termYellow\">",
                Colors::Blue => "<span class=\"termBlue\">",
                Colors::Magenta => "<span class=\"termMagenta\">",
                Colors::Cyan => "<span class=\"termCyan\">",
                Colors::White => "<span class=\"termWhite\">",
                Colors::Reset => "</span>",
            };
            format!("{}", color_id)
        }

        fn text_style(&self, _: TextStyles) -> String {
            panic!("ColorTerminal does not support text styles");
        }
    }

    #[derive(Clone)]
    struct Repository {
        code: String,
        main_hash: usize,
    }

    impl ProgramRepository for Repository {
        fn read_main(&mut self) -> MainProgram {
            let mut main_file_hasher = DefaultHasher::new();
            self.code.hash(&mut main_file_hasher);
            let first_page_hash = main_file_hasher.finish();
            self.main_hash = first_page_hash as usize;
            MainProgram {
                file_content: self.code.clone(),
                file_name: "playground.ei".to_string(),
                file_hash: first_page_hash as usize,
                start_directory: format!("<ellie_module_playground>",),
            }
        }

        fn read_module(
            &mut self,
            _link_module: bool,
            _current_path: String,
            _requested_path: String,
        ) -> ResolvedImport {
            ResolvedImport {
                found: false,
                resolve_error: "Cannot use imports in playground".to_string(),
                ..Default::default()
            }
        }
    }

    let mut program_repository = Repository {
        code: code.to_string(),
        main_hash: 0,
    };
    match tokenizer::tokenize_file(&mut program_repository) {
        Ok(pages) => {
            match compiler::parse_pages(
                program_repository.main_hash,
                vec![],
                pages,
                CompilerSettings {
                    name: "playground".to_string(),
                    file_name: String::from("playground.ei"),
                    is_lib: false,
                    description: String::from("No description"),
                    experimental_features: false,
                    byte_code_architecture: PlatformArchitecture::B32,
                    version: Version::build_from_string("0.1.0".to_string()),
                },
            ) {
                Ok(compile_output) => {
                    if !compile_output.warnings.is_empty() {
                        stdout_write_element(&print_warnings(
                            &compile_output.warnings,
                            |_| code.to_string().replace("\t", "    "),
                            |_| "ellie_playground".to_string(),
                            color_terminal,
                        ));
                        for warning in compile_output.warnings {
                            render_warning(&warning);
                        }
                    }

                    //let bytecode_start = Instant::now();
                    let mut assembler = assembler::Assembler::new(
                        compile_output.module,
                        ellie_bytecode::assembler::PlatformAttributes {
                            architecture: ellie_core::defs::PlatformArchitecture::B32, //64 Bit Limit
                            memory_size: 512000, //512kb memory limit
                        },
                    );
                    let assembler_result = assembler.assemble(Vec::new());
                    let program_binary = assembler_result.render_binary_to_vector();

                    struct ProgramReader {
                        location: usize,
                        program: Vec<u8>,
                    }

                    impl Reader for ProgramReader {
                        fn read(&mut self) -> Option<u8> {
                            println!("Read: {}", self.location);
                            if self.location < self.program.len() {
                                let result = self.program[self.location];
                                self.location += 1;
                                Some(result)
                            } else {
                                None
                            }
                        }
                    }

                    let mut program_reader = ProgramReader {
                        location: 0,
                        program: program_binary,
                    };

                    match read_program(&mut program_reader) {
                        Ok(program) => {
                            let mut vm =
                                ellie_vm::vm::VM::new(PlatformArchitecture::B32, |_, e| {
                                    if e.name == "println" {
                                        let string = String::from_utf8(e.params[0].data.clone());
                                        stdout_write_element(&format!(
                                            "{}{}{}\n",
                                            color_terminal.color(Colors::Cyan),
                                            string.unwrap(),
                                            color_terminal.color(Colors::Reset)
                                        ));
                                        VmNativeAnswer::Ok(().into())
                                    } else {
                                        VmNativeAnswer::RuntimeError(
                                            "Call to unknown function".into(),
                                        )
                                    }
                                });
                            vm.load(&program).unwrap();
                            vm.build_main_thread(program.main);
                            loop {
                                match vm.threads[0].step(&mut vm.heap) {
                                    Ok(_) => (),
                                    Err(e) => match e {
                                        ellie_vm::utils::ThreadExit::Panic(e) => {
                                            stdout_write_element(&&format!(
                                                "\n{}ThreadPanic{} : {}{:?}{}",
                                                color_terminal.color(Colors::Red),
                                                color_terminal.color(Colors::Reset),
                                                color_terminal.color(Colors::Cyan),
                                                e.reason,
                                                color_terminal.color(Colors::Reset),
                                            ));

                                            for frame in e.stack_trace {
                                                stdout_write_element(&&format!(
                                                    "{}    at {}:{}",
                                                    color_terminal.color(Colors::Green),
                                                    frame.name,
                                                    frame.frame_pos
                                                ));
                                            }

                                            stdout_write_element(&
                                            format!(
                                                "\n{}NoDebugFile{} : {}Given error represents stack locations, but not supported for now{}",
                                                color_terminal.color(Colors::Yellow),
                                                color_terminal.color(Colors::Reset),
                                                color_terminal.color(Colors::Cyan),
                                                color_terminal.color(Colors::Reset),
                                            ));

                                            stdout_write_element(&format!(
                                                "{}    at {}",
                                                color_terminal.color(Colors::Red),
                                                e.code_location,
                                            ));

                                            stdout_write_element(&format!(
                                                "{}[VM]{}: Heap Dump\n\n{}",
                                                color_terminal.color(Colors::Yellow),
                                                color_terminal.color(Colors::Reset),
                                                vm.heap_dump()
                                            ));
                                        }
                                        ellie_vm::utils::ThreadExit::ExitGracefully => {
                                            break;
                                        }
                                    },
                                }
                            }

                            stdout_write_element(&format!(
                                "\nEllie : {} - {}",
                                ellie_engine::engine_constants::ELLIE_ENGINE_VERSION,
                                ellie_engine::engine_constants::ELLIE_ENGINE_VERSION_NAME,
                            ));
                        }
                        Err(e) => {
                            stdout_write_element(&&format!(
                                "[{}Failed to read program{}]: {}",
                                color_terminal.color(Colors::Green),
                                color_terminal.color(Colors::Reset),
                                e
                            ));
                        }
                    }
                }
                Err(errors) => {
                    stdout_write_element(
                        &print_errors(
                            &errors,
                            |_| code.to_string().replace("\t", "    "),
                            false,
                            |_| "ellie_playground".to_string(),
                            color_terminal,
                        )
                        .replace("\t", "    "),
                    );

                    for error in &errors {
                        render_error(error)
                    }
                }
            }
        }
        Err(pager_errors) => {
            stdout_write_element(&print_errors(
                &pager_errors,
                |_| code.to_string().replace("\t", "    "),
                false,
                |_| "ellie_playground".to_string(),
                color_terminal,
            ));
            for error in &pager_errors {
                render_error(error)
            }
        }
    }
}

pub fn set_panic_hook() {
    console_error_panic_hook::set_once();
}
