import "../css/theme.css";
import "../css/panel.css";
import "../css/terminal.css";
import "../scss/styles.scss";
import "../index.html";
import init from "./monaco.js";
import { messageHandler, stdout } from "./utils.js";
import { formatCode, getInfo, byteCodeGenerate, compile } from "./pkg/index.js";

document.querySelector(".bottom_panel").innerHTML +=
  `<p class="termMagenta">Ellie Playground</p><br>`;

async function main() {
  let setEditor = await init(onCodeRun, onByteCodeGenerate, onCodeFormat);
  const worker = new Worker(new URL("./ellieworker.js", import.meta.url));
  worker.onmessage = messageHandler;
  messageHandler({
    data: {
      type: "info",
      message: getInfo(),
    },
  });

  document.querySelector(".bottom_panel").innerHTML += `<br>`;

  messageHandler({
    data: {
      type: "info",
      message: "Ready",
    },
  });

  document.querySelector(".bottom_panel").innerHTML += `<br>`;

  function onCodeRun(code) {
    try {
      const time = new Date().getTime();
      const output = compile(stdout, code);
      worker.postMessage({
        cmd: "run",
        code: {
          program: output.program,
          debug_file: output.debug_file,
        },
      });

      messageHandler({
        data: {
          type: "info",
          message: `Compiled in ${new Date().getTime() - time}ms`,
        },
      });
    } catch (err) {
      messageHandler({
        data: {
          type: "error",
          message: err.message,
        },
      });
    }
  }

  function onByteCodeGenerate(code) {
    try {
      const time = new Date().getTime();
      const output = byteCodeGenerate(stdout, code);
      messageHandler({
        data: {
          type: "info",
          message: `Compiled in ${new Date().getTime() - time}ms`,
        },
      });
      messageHandler({
        data: {
          type: "info",
          message: `ByteCode Rendered`,
        },
      });
      setEditor(code + "\n\n/*\n\t" + output.split("\n").join("\n\t") + "\n*/");
    } catch (err) {
      messageHandler({
        data: {
          type: "error",
          message: err.message,
        },
      });
    }
  }

  function onCodeFormat(code) {
    try {
      const time = new Date().getTime();
      const output = formatCode(stdout, code);
      messageHandler({
        data: {
          type: "info",
          message: `Compiled in ${new Date().getTime() - time}ms`,
        },
      });
      messageHandler({
        data: {
          type: "info",
          message: `Code formated`,
        },
      });
      setEditor(output);
    } catch (err) {
      messageHandler({
        data: {
          type: "error",
          message: err.message,
        },
      });
    }
  }
}

main();
