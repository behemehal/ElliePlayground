export function messageHandler({ data: { type, message } }, autoScroll = false) {
  let colorType = "termWhite";

  switch (type) {
    case "error":
    case "error_display":
      colorType = "termRed";
      break;
    case "warning":
    case "warning_display":
      colorType = "termYellow";
      break;
    case "info":
      colorType = "termGreen";
      break;
    default:
      colorType = "termWhite";
      break;
  }
  document.querySelector(".bottom_panel").innerHTML +=
    `<p class="${colorType}">${message}</p>`;

  if (autoScroll) {
    document.querySelector(".bottom_panel").scrollIntoView({
      behavior: 'smooth'
    })

    document.querySelector(".bottom_panel").scrollTop = document.querySelector(
      ".bottom_panel"
    ).scrollHeight;
  }
}

export function stdout(message) {
  try {
    messageHandler({ data: JSON.parse(message) });
    // postMessage(json);
  } catch (_) {
    messageHandler({
      data: {
        type: "error",
        message: "Malformed output arrived",
      },
    });
  }
}
