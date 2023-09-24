import {
  byteCodeGenerate,
  compile,
  formatCode,
  getInfo,
  init,
  run,
} from "./pkg/index.js";

init();

postMessage({
  type: "info",
  message: getInfo() + "<br/><br/>",
});

onmessage = ({ data: { cmd, code } }) => {
  try {
    if (cmd === "runCompile") {
      const compileTime = new Date().getTime();
      const output = compile((e) => {
        try {
          postMessage(JSON.parse(e));
        } catch (_) {
          postMessage({
            type: "error",
            message: "Malformed output arrived",
          });
        }
      }, code);
      postMessage({
        type: "info",
        message: `Code compiled in ${new Date().getTime() - compileTime}ms`,
      });
      const vmTime = new Date().getTime();
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
        output.program,
        output.debug_file,
      );
      postMessage({
        type: "info",
        message: `Code finished executing in ${new Date().getTime() - vmTime}ms`,
      });
    } else if (cmd === "run") {
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
    } else if (cmd === "byteCodeGenerate") {
      const time = new Date().getTime();
      const output = byteCodeGenerate((e) => {
        try {
          postMessage(JSON.parse(e));
        } catch (_) {
          postMessage({
            type: "error",
            message: "Malformed output arrived",
          });
        }
      }, code);
      postMessage({
        type: "info",
        message: `Bytecode generated in ${new Date().getTime() - time}ms`,
      });
      postMessage({
        type: "byteCodeGenerated",
        message: code + "\n\n/*\n\t" + output.split("\n").join("\n\t") + "\n*/",
      });
    } else if (cmd === "formatCode") {
      const time = new Date().getTime();
      const output = formatCode((e) => {
        try {
          postMessage(JSON.parse(e));
        } catch (_) {
          postMessage({
            type: "error",
            message: "Malformed output arrived",
          });
        }
      }, code);
      postMessage({
        type: "info",
        message: `Formated in ${new Date().getTime() - time}ms`,
      });
      postMessage({
        type: "formatedCode",
        message: output,
      });
    }
  } catch (e) {
    console.log("WORKER ERROR: ", e);
  }
};
