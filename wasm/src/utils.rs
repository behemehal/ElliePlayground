use std::{
    collections::hash_map::DefaultHasher,
    hash::{Hash, Hasher},
    io::{Read, Write},
};

use ellie_engine::{
    ellie_core::error,
    ellie_core::warning,
    ellie_renderer_utils::utils::{ColorDisplay, Colors, TextStyles},
    ellie_tokenizer::tokenizer::ResolvedImport,
    ellie_vm::utils::Reader,
    utils::{MainProgram, ProgramRepository},
};

pub fn render_error(error: error::Error) -> String {
    format!("{{\"message_type\": \"error\",\"message\": \"{}\",\"range_start\": [{}, {}],\"range_end\": [{}, {}], \"reference\": {}}}",
    error.builded_message.builded.replace("\"", "\\\""),
    error.pos.range_start.0 - 42,
    error.pos.range_start.1 - 1,
    error.pos.range_start.0 - 42,
    error.pos.range_end.1 - 1,
    if let Some(reference) = &error.reference_block {
        format!("{{\"message\": {} \"range_start\": [{}, {}],\"range_end\": [{}, {}]}}", error.reference_message.replace("\"", "\\\""), reference.0.range_start.0, reference.0.range_start.1 - 1,reference.0.range_end.0,reference.0.range_end.1 - 1,)
    } else {
        "false".to_string()
    })
}

pub fn render_warning(warning: warning::Warning) -> String {
    format!("{{\"message_type\": \"warning\",\"message\": \"{}\",\"range_start\": [{}, {}],\"range_end\": [{}, {}], \"reference\": {}}}",
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
    )
}

#[derive(Copy, Clone)]
pub struct ColorTerminal;

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
pub struct Repository {
    pub code: String,
    pub main_hash: usize,
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

pub struct ProgramReader {
    pub location: usize,
    pub program: Vec<u8>,
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

pub struct VecReader<'a> {
    pub data: &'a mut Vec<u8>,
    pos: usize,
}

impl<'a> VecReader<'a> {
    pub fn new(data: &'a mut Vec<u8>) -> Self {
        VecReader {
            data,
            pos: 0,
        }
    }
}

impl<'a> Read for VecReader<'a> {
    fn read(&mut self, buf: &mut [u8]) -> std::io::Result<usize> {
        let len = std::cmp::min(buf.len(), self.data.len() - self.pos);
        let slice = &self.data[self.pos..self.pos + len];
        buf[..len].copy_from_slice(slice);
        self.pos += len;
        Ok(len)
    }
}

impl<'a> Write for VecReader<'a> {
    fn write(&mut self, buf: &[u8]) -> std::io::Result<usize> {
        self.data.extend_from_slice(buf);
        Ok(buf.len())
    }

    fn flush(&mut self) -> std::io::Result<()> {
        Ok(())
    }
}

pub struct StringWrite {
    pub data: String,
}

impl StringWrite {
    pub fn new() -> StringWrite {
        StringWrite {
            data: String::new(),
        }
    }
}

impl Write for StringWrite {
    fn write(&mut self, buf: &[u8]) -> std::io::Result<usize> {
        self.data.push_str(std::str::from_utf8(buf).unwrap());
        Ok(buf.len())
    }

    fn flush(&mut self) -> std::io::Result<()> {
        Ok(())
    }
}
