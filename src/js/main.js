import "../css/panel.css";
import "../css/terminal.css";
import "../css/theme.css";
import "../index.html";
import "../scss/styles.scss";
import init from "./monaco.js";
import { getInfo } from "./pkg/index.js";
import { messageHandler } from "./utils.js";

document.querySelector(".bottom_panel").innerHTML +=
  `<p class="termMagenta">Ellie Playground</p><br>`;

async function main() {
  let setEditor = await init(onCodeRun, onByteCodeGenerate, onCodeFormat);
  const worker = new Worker(new URL("./ellieworker.js", import.meta.url));
  worker.onmessage = (data) => {
    if (data.data.type === "formatedCode") {
      setEditor(data.data.message);
    } else if (data.data.type === "byteCodeGenerated") {
      setEditor(data.data.message);
    } else {
      messageHandler(data);
    }
  };

  function onCodeRun(code) {
    try {
      worker.postMessage({
        cmd: "runCompile",
        code,
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
      worker.postMessage({
        cmd: "byteCodeGenerate",
        code,
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

  function onCodeFormat(code) {
    try {
      worker.postMessage({
        cmd: "formatCode",
        code,
      });
      // setEditor(output);
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
