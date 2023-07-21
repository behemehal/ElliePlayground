import "../css/theme.css";
import "../css/panel.css";
import "../css/terminal.css";
import "../scss/styles.scss";
import html from "../index.html";
const worker = new Worker(new URL("./ellieworker.js", import.meta.url));
import init from "./monaco.js";

document.querySelector(".bottom_panel").innerHTML += `<p class="termMagenta">Ellie Playground</p><br>`;
document.querySelector(".bottom_panel").innerHTML += `<p class="termYellow">Loading Editor</p>`;

init();
worker.postMessage({
  cmd: "run",
  code: "??",
});

worker.onmessage = ({ data: { type, message } }) => {
  console.log("type", type);
  console.log("message", message);
}; 