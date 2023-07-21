import def from "./def.js";

export default function async() {
  import("monaco-editor")
    .then(({ languages, editor, MarkerSeverity, KeyMod, KeyCode }) => {
      console.log("Module imported");
      document.querySelector(".loading").style.display = "none";
      document.querySelector(".bottom_panel").innerHTML += `<p class="termGreen">Editor Loaded</p>`;

      languages.register({
        id: "ellie",
        extensions: [".ellie"],
        aliases: ["Ellie"],
        mimes: ["text/ellie"],
      });

      languages.setMonarchTokensProvider("ellie", def);

      //Register formatter
      languages.registerDocumentFormattingEditProvider("ellie", {
        provideDocumentFormattingEdits: function (model, options, token) {
          document.querySelector(".bottom_panel").innerHTML += `<p class="termYellow">Formating code...</p>`;
          console.log("model", model);
          console.log("options", options);
          console.log("token", token);
          return editor.getFormattingEditsForRange();
        },
      });

      languages.registerCompletionItemProvider("ellie", {
        provideCompletionItems: function (model, position) {
          var suggestions = [];

          //extend array
          def.typeKeywords.forEach(function (keyword) {
            suggestions.push({
              label: keyword,
              kind: monaco.languages.CompletionItemKind.Value,
              documentation: "",
              insertText: keyword,
            });
          });

          def.keywords.forEach(function (keyword) {
            suggestions.push({
              label: keyword,
              kind: monaco.languages.CompletionItemKind.Keyword,
              documentation: "",
              insertText: keyword,
            });
          });
          return { suggestions: suggestions };
        },
      });

      /* var _editor = editor.create(document.getElementById("container_left"), {
        value: `fn main() {
            v count = 0;
            v continue = true;
            //Loop until 'count' is equal or less than 3
            loop count <= 3 {
              println("Count: " + count);
              //increment count by one
              count += 1;
            }
          }`,
        language: "ellie",
        theme: "vs-dark",
      }); */

      //let half of the screen be the editor
      //open with transition: width 1s ease 0s; 1 time
      document.querySelector("#container_left").style["transition"] = "width 1s ease 0s";
      document.querySelector(".seperator").style.left = window.innerWidth / 2 + "px";
      document.querySelector("#container_left").style.width = window.innerWidth / 2 + "px";
      document.querySelector("#container_left").addEventListener("transitionend", () => {
        document.querySelector("#container_left").style["transition"] = null;
        _editor.layout();
      });
      document.querySelector("#container_left").addEventListener("webkitTransitionEnd", () => {
        document.querySelector("#container_left").style["transition"] = null;
        _editor.layout();
      });
      document.querySelector(".seperator").addEventListener("mousedown", (e) => {
        e.preventDefault();
        document.onmousemove = (e) => {
          document.querySelector(".seperator").style.left = e.pageX + "px";
          document.querySelector("#container_left").style.width = e.pageX + "px";
          //document.querySelector(".right_panel").style.width = window.innerWidth - e.pageX + "px";
          _editor.layout();
        };
        document.onmouseup = () => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      });



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
            KeyMod.CtrlCmd | KeyCode.KeyM
          ),
        ],
        precondition: null,
        keybindingContext: null,
        contextMenuGroupId: "navigation",
        contextMenuOrder: 0,
        run: function (ed) {
            document.querySelector(".bottom_panel").innerHTML += `<p class="termYellow">Generating bytecode</p>`;
        },
      });

      document.getElementById("hw_example").onclick = () => {
        _editor.setValue('fn main() {\n\tprintln("Hello world!");\n}');
      };

      document.getElementById("fib_example").onclick = () => {
        _editor.setValue(
          `fn main() {
            v last = 0;
            v curr = 1;
            v loop_count = 0;
            v fib = 0;
            
            loop loop_count <= 10 {
              fib = last + curr;
              last = curr;
              curr = fib;
              loop_count += 1;
            }
            println("Fib: " + fib);
          }`
        );
      };

      document.getElementById("loop_example").onclick = () => {
        _editor.setValue(
          "fn main() {\n\tv count = 0;\n\tv continue = true;\n\t//Loop until 'continue' is false\n\tloop continue {\n\t\t//If count reaches to 3\n\t\tif count > 3 {\n\t\t\t//Make continue false\n\t\t\tcontinue = false;\n\t\t} else {\n\t\t\t//Print count\n\t\t\tprintln(\"Count: \" + count);\n\t\t}\n\t\t//increment count by one\n\t\tcount += 1;\n\t}\n}"
        );
      };

      document.getElementById("func_example").onclick = () => {
        _editor.setValue(
          'fn main() {\n\tfn collect(first: int, second: int) : int {\n\t\tv collection = first + second;\n\t\tret collection;\n\t}\n\tprintln("4 + 3 = " + collect(4, 3));\n}'
        );
      };
    })
    .catch((err) => {
      console.error(err);
    });
}
