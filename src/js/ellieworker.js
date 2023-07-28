import { run } from "./pkg/index.js";

onmessage = ({ data: { cmd, code } }) => {
  if (cmd === "run") {
    const time = new Date().getTime();
    try {
      run(
        (e) => {
          try {
            postMessage(JSON.parse(e));
          } catch (_) {
            postMessage({
              type: "error",
              message: "Malformed output arrived",
            });
          }
        },
        code.program,
        code.debug_file,
      );
      postMessage({
        type: "info",
        message: `Code finished executing in ${new Date().getTime() - time}ms`,
      });
    } catch (err) {
      postMessage({
        type: "error",
        message: `Worker wasm vm error: ${err.message}`,
      });
    }
  }
};
