import "../css/variables.css";
import "../css/panel.css";
import "../css/terminal.css";
import "../css/theme.css";
import "../index.html";
import "../scss/styles.scss";
import init from "./monaco.js";
import { Tab } from "bootstrap";
import { messageHandler } from "./utils.js";

document.querySelector(".bottom_panel").innerHTML +=
  `<p class="termMagenta">Ellie Playground</p><br>`;

new Tab('#nav-tab')

// VSCode-style resizable console dock: drag the handle to grow/shrink the console.
(function initConsoleResizer() {
  const resizer = document.querySelector(".console-resizer");
  const consoleEl = document.querySelector(".bottom_panel");
  const container = document.querySelector(".right_panel");
  if (!resizer || !consoleEl || !container) return;

  let dragging = false;

  resizer.addEventListener("mousedown", (e) => {
    e.preventDefault();
    dragging = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const rect = container.getBoundingClientRect();
    const min = 140; // keep the console usable
    const max = rect.height - 200; // always leave room for help + toolbar
    const height = Math.max(min, Math.min(max, rect.bottom - e.clientY));
    consoleEl.style.flex = "0 0 auto";
    consoleEl.style.height = height + "px";
  });

  document.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  });
})();

async function main() {
  let autoScroll = false;
  const setEditor = await init(onCodeRun, onByteCodeGenerate, onCodeFormat);
  const worker = new Worker(new URL("./ellieworker.js", import.meta.url));
  worker.onmessage = (data) => {
    if (data.data.type === "formatedCode") {
      setEditor(data.data.message);
    } else if (data.data.type === "byteCodeGenerated") {
      setEditor(data.data.message);
    } else {
      messageHandler(data, autoScroll);
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
      }, autoScroll);
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
      }, autoScroll);
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
      }, autoScroll);
    }
  }

  document.getElementById('autoScrollLogs').onchange = function (e) {
    autoScroll = e.target.checked;
    if (autoScroll) {
      document.querySelector(".bottom_panel").scrollTop = document.querySelector(
        ".bottom_panel"
      ).scrollHeight;
      messageHandler({ data: { type: "info", message: "Auto Scroll: Enabled" } });
    } else {
      messageHandler({ data: { type: "info", message: "Auto Scroll: Disabled" } });
    }
  }
}

main();
