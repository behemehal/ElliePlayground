import init, { run } from "./ellie_playground.js";
require.config({ paths: { vs: "./public/monaco-editor/min/vs" } });
require(["vs/editor/editor.main"], function () {
  monaco.languages.register({
    id: "ellie",
    extensions: [".ellie"],
    aliases: ["Ellie"],
    mimes: ["text/ellie"],
  });

  let def = {
    // Set defaultToken to invalid to see what you do not tokenize yet
    // defaultToken: 'invalid',

    keywords: [
      "enum",
      "loop",
      "go",
      "brk",
      "new",
      "async",
      "await",
      "if",
      "else",
      "pri",
      "pub",
      "ret",
      "catch",
      "try",
      "c",
      "v",
      "import",
      "self",
      "for",
      "true",
      "false",
      "class",
      "extend",
      "fn",
    ],

    typeKeywords: [
      "bool",
      "double",
      "byte",
      "int",
      "float",
      "char",
      "void",
      "null",
      "string",
      "cloak",
      "array",
      "vector",
      "collective",
    ],

    operators: [
      "=",
      ">",
      ":",
      "<",
      "!",
      "~",
      "?",
      ":",
      "==",
      "<=",
      ">=",
      "!=",
      "&&",
      "||",
      "++",
      "--",
      "+",
      "-",
      "*",
      "/",
      "&",
      "|",
      "^",
      "%",
      "<<",
      ">>",
      ">>>",
      "+=",
      "-=",
      "*=",
      "/=",
      "&=",
      "|=",
      "^=",
      "%=",
      "<<=",
      ">>=",
      ">>>=",
    ],

    // we include these common regular expressions
    symbols: /[=><!~?:&|+\-*\/\^%]+/,

    // C# style strings
    escapes:
      /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

    // The main tokenizer for our languages
    tokenizer: {
      root: [
        // identifiers and keywords
        [
          /[a-z_$][\w$]*/,
          {
            cases: {
              "@typeKeywords": "keyword",
              "@keywords": "keyword",
              "@default": "identifier",
            },
          },
        ],
        [/[A-Z][\w\$]*/, "type.identifier"], // to show class names nicely

        // whitespace
        { include: "@whitespace" },

        // delimiters and operators
        [/[{}()\[\]]/, "@brackets"],
        [/[<>](?!@symbols)/, "@brackets"],
        [
          /@symbols/,
          {
            cases: {
              "@operators": "operator",
              "@default": "",
            },
          },
        ],

        // @ Item File Key
        [
          /@\s*[a-zA-Z_\$][\w\$]*/,
          { token: "filekey", log: "annotation token: $0" },
        ],

        // @! Global File Key
        [
          /@!\s*[a-zA-Z_\$][\w\$]*/,
          { token: "global_filekey", log: "annotation token: $0" },
        ],

        // numbers
        [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
        [/0[xX][0-9a-fA-F]+/, "number.hex"],
        [/\d+/, "number"],

        // delimiter: after number because of .\d floats
        [/[;,.]/, "delimiter"],

        // strings
        [/"([^"\\]|\\.)*$/, "string.invalid"], // non-teminated string
        [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],

        // characters
        [/'[^\\']'/, "string"],
        [/(')(@escapes)(')/, ["string", "string.escape", "string"]],
        [/'/, "string.invalid"],
      ],

      comment: [
        [/[^\/*]+/, "comment"],
        [/\/\*/, "comment", "@push"], // nested comment
        ["\\*/", "comment", "@pop"],
        [/[\/*]/, "comment"],
      ],

      string: [
        [/[^\\"]+/, "string"],
        [/@escapes/, "string.escape"],
        [/\\./, "string.escape.invalid"],
        [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
      ],

      whitespace: [
        [/[ \t\r\n]+/, "white"],
        [/\/\*/, "comment", "@comment"],
        [/\/\/.*$/, "comment"],
      ],
    },
  };

  //Resize monaco editor
  window.addEventListener("resize", function () {
    editor.layout();
  })

  monaco.languages.setMonarchTokensProvider("ellie", def);

  monaco.languages.registerCompletionItemProvider("ellie", {
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

  var editor = monaco.editor.create(document.getElementById("container_left"), {
    value:
      "fn main() {\n\tv count = 0;\n\tv continue = true;\n\t//Loop until 'continue' is false\n\tloop continue {\n\t\t//If count reaches to 3\n\t\tif count > 3 {\n\t\t\t//Make continue false\n\t\t\tcontinue = false;\n\t\t} else {\n\t\t\t//Print count\n\t\t\tprintln(\"Count: \" + count);\n\t\t}\n\t\t//increment count by one\n\t\tcount += 1;\n\t}\n}",
    language: "ellie",
    theme: "vs-dark",
  });

  document.getElementById("hw_example").onclick = () => {
    editor.setValue('fn main() {\n\tprintln("Hello world!");\n}');
  };

  document.getElementById("fib_example").onclick = () => {
    editor.setValue(
      "fn main() {\n\tv last = 0;\n\tv curr = 1;\n\tv loop_go = true;\n\tv loop_count = 0;\n\t\n\tloop loop_go {\n\t\tv fib = last + curr;\n\t\tlast = curr;\n\t\tcurr = fib;\n\t\tloop_count += 1;\n\t\tif loop_count == 10 {\n\t\t\tloop_go = false;\n\t\t\tprintln(\"Fib: \" + fib);\n\t\t}\n\t}\n}"
    );
  };

  document.getElementById("loop_example").onclick = () => {
    editor.setValue(
      "fn main() {\n\tv count = 0;\n\tv continue = true;\n\t//Loop until 'continue' is false\n\tloop continue {\n\t\t//If count reaches to 3\n\t\tif count > 3 {\n\t\t\t//Make continue false\n\t\t\tcontinue = false;\n\t\t} else {\n\t\t\t//Print count\n\t\t\tprintln(\"Count: \" + count);\n\t\t}\n\t\t//increment count by one\n\t\tcount += 1;\n\t}\n}"
    );
  };

  document.getElementById("func_example").onclick = () => {
    editor.setValue(
      "fn main() {\n\tfn collect(first: int, second: int) : int {\n\t\tv collection = first + second;\n\t\tret collection;\n\t}\n\tprintln(\"4 + 3 = \" + collect(4, 3));\n}"
    );
  };


  //get text of editor
  function getText() {
    return editor.getValue();
  }

  window.ddd = editor;
  init()
    .then(() => {
      document.getElementById("clr_btn").onclick = () => {
        document.getElementById("container_right_up").innerHTML =
          '<p class="termGreen">Console Cleaned</p>';
      };

      document.getElementById("run_btn").onclick = () => {
        let text = getText();
        console.log("run", text);
        let time_now = new Date().getTime();
        run(text);
        let time_end = new Date().getTime();
        window.run = run;

        document.getElementById("container_right_up").innerHTML +=
          '<br><p class="termGreen">Completed in: ' +
          (time_end - time_now) / 1000 +
          "s</p>";

        let markers = [];
        let outputs = [...document.getElementById("errout").children].map(
          (x) => {
            try {
              return JSON.parse(x.innerText);
            } catch (_) {
              console.log("error", x.innerText);
              return {};
            }
          }
        );

        for (let i = 0; i < outputs.length; i++) {
          let output = outputs[i];
          if (output.message_type == "warning") {
            let warning = {
              startLineNumber: output.range_start[0],
              endLineNumber: output.range_end[0],
              startColumn: output.range_start[1],
              endColumn: output.range_end[1],
              message: output.message,
              severity: monaco.MarkerSeverity.Warning,
            };

            if (output.reference != false) {
              warning["relatedInformation"] = [
                {
                  startLineNumber: output.reference.range_start[0],
                  endLineNumber: output.reference.range_end[0],
                  startColumn: output.reference.range_start[1],
                  endColumn: output.reference.range_end[1],
                  message: output.reference.message,
                },
              ];
            }

            markers.push(warning);
          } else if (output.message_type == "error") {
            let error = {
              startLineNumber: output.range_start[0],
              endLineNumber: output.range_end[0],
              startColumn: output.range_start[1],
              endColumn: output.range_end[1],
              message: output.message,
              severity: monaco.MarkerSeverity.Error,
            };

            if (output.reference != false) {
              error["relatedInformation"] = [
                {
                  startLineNumber: output.reference.range_start[0],
                  endLineNumber: output.reference.range_end[0],
                  startColumn: output.reference.range_start[1],
                  endColumn: output.reference.range_end[1],
                  message: output.reference.message,
                },
              ];
            }
            markers.push(error);
          }
        }
        document.getElementById("errout").innerHTML = "";
        monaco.editor.setModelMarkers(editor.getModel(), "ellie", markers);
      };
    })
    .catch((err) => {
      console.error(err);
    });
});
