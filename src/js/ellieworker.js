onmessage = ({ data: { cmd, code } }) => {
  if (cmd === "run") {
    console.log("run");
    console.log(code);
  } else if (cmd == "format") {
    console.log("format");
    console.log(code);
  }
};

postMessage({ type: "error", message: "Error" });
