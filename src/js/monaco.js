import codeExamples from "./codeExamples.js";
import def from "./def.js";

export default async function editor(
  onRun,
  onByteCodeGenerate,
  onFormatRequest,
) {
  const { languages, editor, KeyMod, KeyCode } = await import("monaco-editor");
  document.querySelector(".loading").style.display = "none";

  languages.register({
    id: "ellie",
    extensions: [".ei"],
    aliases: ["Ellie"],
    mimes: ["text/ellie"],
  });

  languages.setMonarchTokensProvider("ellie", def);

  //Register formatter
  languages.registerDocumentFormattingEditProvider("ellie", {
    provideDocumentFormattingEdits: function (model, options, token) {
      document.querySelector(".bottom_panel").innerHTML +=
        `<p class="termYellow">Formating code</p>`;
      onFormatRequest(_editor.getValue());
      return editor.getFormattingEditsForRange();
    },
  });

  languages.registerCompletionItemProvider("ellie", {
    provideCompletionItems: function (model, position) {
      const suggestions = [];

      //extend array
      def.typeKeywords.forEach(function (keyword) {
        suggestions.push({
          label: keyword,
          kind: languages.CompletionItemKind.Value,
          documentation: "",
          insertText: keyword,
        });
      });

      def.keywords.forEach(function (keyword) {
        suggestions.push({
          label: keyword,
          kind: languages.CompletionItemKind.Keyword,
          documentation: "",
          insertText: keyword,
        });
      });
      return { suggestions: suggestions };
    },
  });

  const _editor = editor.create(document.getElementById("container_left"), {
    value: codeExamples[0].code,
    language: "ellie",
    theme: "vs-dark",
  });

  //let half of the screen be the editor
  //open with transition: width 1s ease 0s; 1 time
  document.querySelector("#container_left").style["transition"] =
    "width 1s ease 0s";
  document.querySelector(".seperator").style.left = window.innerWidth / 2 +
    "px";
  document.querySelector("#container_left").style.width =
    window.innerWidth / 2 + "px";
  document.querySelector("#container_left").addEventListener(
    "transitionend",
    () => {
      document.querySelector("#container_left").style["transition"] = null;
      _editor.layout();
    },
  );

  document.querySelector("#container_left").addEventListener(
    "webkitTransitionEnd",
    () => {
      document.querySelector("#container_left").style["transition"] = null;
      _editor.layout();
    },
  );

  document.querySelector(".seperator").addEventListener(
    "mousedown",
    (e) => {
      e.preventDefault();
      document.onmousemove = (e) => {
        document.querySelector(".seperator").style.left = e.pageX + "px";
        document.querySelector("#container_left").style.width = e.pageX +
          "px";
        //document.querySelector(".right_panel").style.width = window.innerWidth - e.pageX + "px";
        _editor.layout();
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
  );

  window.addEventListener("resize", function () {
    _editor.layout();
  });
  _editor.addAction({
    id: "show-bytecode",
    label: "Show Bytecode",
    keybindings: [
      KeyMod.CtrlCmd | KeyCode.F10,
      // chord
      KeyMod.chord(
        KeyMod.CtrlCmd | KeyCode.KeyK,
        KeyMod.CtrlCmd | KeyCode.KeyM,
      ),
    ],
    precondition: null,
    keybindingContext: null,
    contextMenuGroupId: "navigation",
    contextMenuOrder: 0,
    run: function () {
      document.querySelector(".bottom_panel").innerHTML +=
        `<p class="termYellow">Generating bytecode</p>`;
      onByteCodeGenerate(_editor.getValue());
    },
  });

  for (const example of codeExamples) {
    const li = document.createElement("li");
    li.innerHTML =
      `<a id="${example.title}_btn" href="#${example.title}" >${example.name}</a>`;
    document.querySelector("#examples").appendChild(li);
    document.getElementById(`${example.title}_btn`).onclick = () => {
      _editor.setValue(example.code);
    };
  }

  document.getElementById("run_btn").onclick = () => {
    onRun(_editor.getValue());
  };

  document.getElementById("clr_btn").onclick = () => {
    document.querySelector(".bottom_panel").innerHTML +=
        `<p class="termGreen">Console cleaned</p>`;
  };

  return (value) => {
    _editor.setValue(value);
  };
}
