/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 9459:
/***/ ((module, __unused_webpack___webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony import */ var _pkg_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4025);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_pkg_index_js__WEBPACK_IMPORTED_MODULE_0__]);
_pkg_index_js__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


(0,_pkg_index_js__WEBPACK_IMPORTED_MODULE_0__/* .init */ .S1)();

postMessage({
  type: "info",
  message: (0,_pkg_index_js__WEBPACK_IMPORTED_MODULE_0__/* .getInfo */ .C5)() + "<br/><br/>",
});

onmessage = ({ data: { cmd, code } }) => {
  try {
    if (cmd === "runCompile") {
      const compileTime = new Date().getTime();
      const output = (0,_pkg_index_js__WEBPACK_IMPORTED_MODULE_0__/* .compile */ .MY)((e) => {
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
      (0,_pkg_index_js__WEBPACK_IMPORTED_MODULE_0__/* .run */ .KH)(
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
        (0,_pkg_index_js__WEBPACK_IMPORTED_MODULE_0__/* .run */ .KH)(
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
      const output = (0,_pkg_index_js__WEBPACK_IMPORTED_MODULE_0__/* .byteCodeGenerate */ .OH)((e) => {
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
      const output = (0,_pkg_index_js__WEBPACK_IMPORTED_MODULE_0__/* .formatCode */ .XQ)((e) => {
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

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 4025:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "C5": () => (/* reexport safe */ _index_bg_js__WEBPACK_IMPORTED_MODULE_0__.C5),
/* harmony export */   "KH": () => (/* reexport safe */ _index_bg_js__WEBPACK_IMPORTED_MODULE_0__.KH),
/* harmony export */   "MY": () => (/* reexport safe */ _index_bg_js__WEBPACK_IMPORTED_MODULE_0__.MY),
/* harmony export */   "OH": () => (/* reexport safe */ _index_bg_js__WEBPACK_IMPORTED_MODULE_0__.OH),
/* harmony export */   "S1": () => (/* reexport safe */ _index_bg_js__WEBPACK_IMPORTED_MODULE_0__.S1),
/* harmony export */   "XQ": () => (/* reexport safe */ _index_bg_js__WEBPACK_IMPORTED_MODULE_0__.XQ)
/* harmony export */ });
/* harmony import */ var _index_bg_wasm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4488);
/* harmony import */ var _index_bg_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2858);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_index_bg_wasm__WEBPACK_IMPORTED_MODULE_1__]);
_index_bg_wasm__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


(0,_index_bg_js__WEBPACK_IMPORTED_MODULE_0__/* .__wbg_set_wasm */ .oT)(_index_bg_wasm__WEBPACK_IMPORTED_MODULE_1__);


__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 2858:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$3": () => (/* binding */ __wbg_newnoargs_581967eacc0e2604),
/* harmony export */   "B3": () => (/* binding */ __wbg_now_9c5990bda04c7e53),
/* harmony export */   "Bj": () => (/* binding */ __wbg_node_1cd7a5d853dbea79),
/* harmony export */   "C5": () => (/* binding */ getInfo),
/* harmony export */   "CN": () => (/* binding */ __wbg_newwithlength_e5d69174d6984cd7),
/* harmony export */   "E$": () => (/* binding */ __wbg_globalThis_1d39714405582d3c),
/* harmony export */   "F": () => (/* binding */ __wbg_randomFillSync_dc1e9a60c158336d),
/* harmony export */   "G6": () => (/* binding */ __wbindgen_cb_drop),
/* harmony export */   "H6": () => (/* binding */ __wbg_set_5cf90238115182c3),
/* harmony export */   "KH": () => (/* binding */ run),
/* harmony export */   "KM": () => (/* binding */ __wbg_stack_658279fe44541cf6),
/* harmony export */   "Ky": () => (/* binding */ __wbg_length_72e2208bbc0efc61),
/* harmony export */   "MY": () => (/* binding */ compile),
/* harmony export */   "Nl": () => (/* binding */ __wbg_call_01734de55d61e11d),
/* harmony export */   "OH": () => (/* binding */ byteCodeGenerate),
/* harmony export */   "Od": () => (/* binding */ __wbg_call_cb65541d95d71282),
/* harmony export */   "Or": () => (/* binding */ __wbindgen_throw),
/* harmony export */   "PY": () => (/* binding */ __wbg_subarray_13db269f57aa838d),
/* harmony export */   "Qz": () => (/* binding */ __wbg_window_5f4faef6c12b79ec),
/* harmony export */   "S1": () => (/* binding */ init),
/* harmony export */   "Sc": () => (/* binding */ __wbg_crypto_c48a774b022d20ac),
/* harmony export */   "TE": () => (/* binding */ __wbg_getRandomValues_37fa2ca9e4e07fab),
/* harmony export */   "Vb": () => (/* binding */ __wbg_process_298734cf255a885d),
/* harmony export */   "Wc": () => (/* binding */ __wbg_require_8f08ceecec0f4fee),
/* harmony export */   "Wl": () => (/* binding */ __wbindgen_is_object),
/* harmony export */   "XP": () => (/* binding */ __wbindgen_is_undefined),
/* harmony export */   "XQ": () => (/* binding */ formatCode),
/* harmony export */   "Zf": () => (/* binding */ __wbg_buffer_085ec1f694018c4f),
/* harmony export */   "a2": () => (/* binding */ __wbg_new_abda76e883ba8a5f),
/* harmony export */   "c7": () => (/* binding */ __wbg_global_651f05c6a0944d1c),
/* harmony export */   "cU": () => (/* binding */ __wbg_versions_e2e78e134e3e5d01),
/* harmony export */   "eY": () => (/* binding */ __wbindgen_is_string),
/* harmony export */   "ey": () => (/* binding */ __wbg_self_1ff1d729e9aae938),
/* harmony export */   "fY": () => (/* binding */ __wbindgen_debug_string),
/* harmony export */   "fr": () => (/* binding */ __wbg_newwithbyteoffsetandlength_6da8e527659b86aa),
/* harmony export */   "gE": () => (/* binding */ __wbg_log_1d3ae0273d8f4f8a),
/* harmony export */   "gj": () => (/* binding */ __wbg_msCrypto_bcb970640f50a1e8),
/* harmony export */   "h4": () => (/* binding */ __wbindgen_string_new),
/* harmony export */   "iX": () => (/* binding */ __wbg_error_f851667af71bcfc6),
/* harmony export */   "j1": () => (/* binding */ __wbindgen_closure_wrapper4248),
/* harmony export */   "m_": () => (/* binding */ __wbindgen_object_clone_ref),
/* harmony export */   "o$": () => (/* binding */ __wbindgen_is_function),
/* harmony export */   "oH": () => (/* binding */ __wbindgen_memory),
/* harmony export */   "oT": () => (/* binding */ __wbg_set_wasm),
/* harmony export */   "ot": () => (/* binding */ __wbg_resolve_53698b95aaf7fcf8),
/* harmony export */   "rU": () => (/* binding */ __wbg_new_8125e318e6245eed),
/* harmony export */   "ug": () => (/* binding */ __wbindgen_object_drop_ref),
/* harmony export */   "vv": () => (/* binding */ __wbg_then_f7e06ee3c11698eb)
/* harmony export */ });
/* unused harmony export CompileResult */
/* module decorator */ module = __webpack_require__.hmd(module);
let wasm;
function __wbg_set_wasm(val) {
    wasm = val;
}


const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_24(arg0, arg1, arg2) {
    wasm.wasm_bindgen__convert__closures__invoke1_mut__h6d637a4fd7dc6a81(arg0, arg1, addHeapObject(arg2));
}

/**
*/
function init() {
    wasm.init();
}

/**
* @param {any} stdout
* @param {string} codec
* @returns {string | undefined}
*/
function byteCodeGenerate(stdout, codec) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(codec, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.byteCodeGenerate(retptr, addHeapObject(stdout), ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        let v2;
        if (r0 !== 0) {
            v2 = getStringFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
        }
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {any} stdout
* @param {string} codec
* @returns {string | undefined}
*/
function formatCode(stdout, codec) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(codec, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.formatCode(retptr, addHeapObject(stdout), ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        let v2;
        if (r0 !== 0) {
            v2 = getStringFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
        }
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {any} stdout
* @param {string} codec
* @returns {CompileResult | undefined}
*/
function compile(stdout, codec) {
    const ptr0 = passStringToWasm0(codec, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.compile(addHeapObject(stdout), ptr0, len0);
    return ret === 0 ? undefined : CompileResult.__wrap(ret);
}

/**
* @param {any} stdout
* @param {Uint8Array} js_objects
* @param {string} debug_file
*/
function run(stdout, js_objects, debug_file) {
    const ptr0 = passStringToWasm0(debug_file, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.run(addHeapObject(stdout), addHeapObject(js_objects), ptr0, len0);
}

/**
* @returns {string}
*/
function getInfo() {
    let deferred1_0;
    let deferred1_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getInfo(retptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
/**
*/
class CompileResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompileResult.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compileresult_free(ptr);
    }
    /**
    * @param {Uint8Array} program
    * @param {string} debug_file
    */
    constructor(program, debug_file) {
        const ptr0 = passStringToWasm0(debug_file, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.compileresult_new(addHeapObject(program), ptr0, len0);
        return CompileResult.__wrap(ret);
    }
    /**
    * @returns {Uint8Array}
    */
    get program() {
        const ret = wasm.compileresult_program(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * @param {Uint8Array} program
    */
    set program(program) {
        wasm.compileresult_set_program(this.__wbg_ptr, addHeapObject(program));
    }
    /**
    * @returns {string}
    */
    get debug_file() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compileresult_debug_file(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @param {string} debug_file
    */
    set debug_file(debug_file) {
        const ptr0 = passStringToWasm0(debug_file, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.compileresult_set_debug_file(this.__wbg_ptr, ptr0, len0);
    }
}

function __wbg_new_abda76e883ba8a5f() {
    const ret = new Error();
    return addHeapObject(ret);
};

function __wbg_stack_658279fe44541cf6(arg0, arg1) {
    const ret = getObject(arg1).stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};

function __wbg_error_f851667af71bcfc6(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
};

function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

function __wbindgen_object_clone_ref(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
};

function __wbg_log_1d3ae0273d8f4f8a(arg0) {
    console.log(getObject(arg0));
};

function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

function __wbindgen_memory() {
    const ret = wasm.memory;
    return addHeapObject(ret);
};

function __wbg_buffer_085ec1f694018c4f(arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

function __wbg_newwithbyteoffsetandlength_6da8e527659b86aa(arg0, arg1, arg2) {
    const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

function __wbg_new_8125e318e6245eed(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};

function __wbg_length_72e2208bbc0efc61(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};

function __wbg_now_9c5990bda04c7e53() {
    const ret = Date.now();
    return ret;
};

function __wbindgen_is_object(arg0) {
    const val = getObject(arg0);
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};

function __wbg_crypto_c48a774b022d20ac(arg0) {
    const ret = getObject(arg0).crypto;
    return addHeapObject(ret);
};

function __wbg_process_298734cf255a885d(arg0) {
    const ret = getObject(arg0).process;
    return addHeapObject(ret);
};

function __wbg_versions_e2e78e134e3e5d01(arg0) {
    const ret = getObject(arg0).versions;
    return addHeapObject(ret);
};

function __wbg_node_1cd7a5d853dbea79(arg0) {
    const ret = getObject(arg0).node;
    return addHeapObject(ret);
};

function __wbindgen_is_string(arg0) {
    const ret = typeof(getObject(arg0)) === 'string';
    return ret;
};

function __wbg_require_8f08ceecec0f4fee() { return handleError(function () {
    const ret = module.require;
    return addHeapObject(ret);
}, arguments) };

function __wbindgen_is_function(arg0) {
    const ret = typeof(getObject(arg0)) === 'function';
    return ret;
};

function __wbg_msCrypto_bcb970640f50a1e8(arg0) {
    const ret = getObject(arg0).msCrypto;
    return addHeapObject(ret);
};

function __wbg_newwithlength_e5d69174d6984cd7(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return addHeapObject(ret);
};

function __wbg_self_1ff1d729e9aae938() { return handleError(function () {
    const ret = self.self;
    return addHeapObject(ret);
}, arguments) };

function __wbg_window_5f4faef6c12b79ec() { return handleError(function () {
    const ret = window.window;
    return addHeapObject(ret);
}, arguments) };

function __wbg_globalThis_1d39714405582d3c() { return handleError(function () {
    const ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };

function __wbg_global_651f05c6a0944d1c() { return handleError(function () {
    const ret = __webpack_require__.g.global;
    return addHeapObject(ret);
}, arguments) };

function __wbindgen_is_undefined(arg0) {
    const ret = getObject(arg0) === undefined;
    return ret;
};

function __wbg_newnoargs_581967eacc0e2604(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

function __wbg_call_cb65541d95d71282() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

function __wbg_call_01734de55d61e11d() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

function __wbg_set_5cf90238115182c3(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

function __wbg_randomFillSync_dc1e9a60c158336d() { return handleError(function (arg0, arg1) {
    getObject(arg0).randomFillSync(takeObject(arg1));
}, arguments) };

function __wbg_subarray_13db269f57aa838d(arg0, arg1, arg2) {
    const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

function __wbg_getRandomValues_37fa2ca9e4e07fab() { return handleError(function (arg0, arg1) {
    getObject(arg0).getRandomValues(getObject(arg1));
}, arguments) };

function __wbindgen_debug_string(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};

function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

function __wbindgen_cb_drop(arg0) {
    const obj = takeObject(arg0).original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    const ret = false;
    return ret;
};

function __wbg_then_f7e06ee3c11698eb(arg0, arg1) {
    const ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
};

function __wbg_resolve_53698b95aaf7fcf8(arg0) {
    const ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
};

function __wbindgen_closure_wrapper4248(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 140, __wbg_adapter_24);
    return addHeapObject(ret);
};



/***/ }),

/***/ 4488:
/***/ ((module, exports, __webpack_require__) => {

/* harmony import */ var WEBPACK_IMPORTED_MODULE_0 = __webpack_require__(2858);
module.exports = __webpack_require__.v(exports, module.id, "c892e7fa0b85fc585b11", {
	"./index_bg.js": {
		"__wbg_new_abda76e883ba8a5f": WEBPACK_IMPORTED_MODULE_0/* .__wbg_new_abda76e883ba8a5f */ .a2,
		"__wbg_stack_658279fe44541cf6": WEBPACK_IMPORTED_MODULE_0/* .__wbg_stack_658279fe44541cf6 */ .KM,
		"__wbg_error_f851667af71bcfc6": WEBPACK_IMPORTED_MODULE_0/* .__wbg_error_f851667af71bcfc6 */ .iX,
		"__wbindgen_object_drop_ref": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_object_drop_ref */ .ug,
		"__wbindgen_object_clone_ref": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_object_clone_ref */ .m_,
		"__wbg_log_1d3ae0273d8f4f8a": WEBPACK_IMPORTED_MODULE_0/* .__wbg_log_1d3ae0273d8f4f8a */ .gE,
		"__wbindgen_string_new": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_string_new */ .h4,
		"__wbindgen_memory": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_memory */ .oH,
		"__wbg_buffer_085ec1f694018c4f": WEBPACK_IMPORTED_MODULE_0/* .__wbg_buffer_085ec1f694018c4f */ .Zf,
		"__wbg_newwithbyteoffsetandlength_6da8e527659b86aa": WEBPACK_IMPORTED_MODULE_0/* .__wbg_newwithbyteoffsetandlength_6da8e527659b86aa */ .fr,
		"__wbg_new_8125e318e6245eed": WEBPACK_IMPORTED_MODULE_0/* .__wbg_new_8125e318e6245eed */ .rU,
		"__wbg_length_72e2208bbc0efc61": WEBPACK_IMPORTED_MODULE_0/* .__wbg_length_72e2208bbc0efc61 */ .Ky,
		"__wbg_now_9c5990bda04c7e53": WEBPACK_IMPORTED_MODULE_0/* .__wbg_now_9c5990bda04c7e53 */ .B3,
		"__wbindgen_is_object": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_is_object */ .Wl,
		"__wbg_crypto_c48a774b022d20ac": WEBPACK_IMPORTED_MODULE_0/* .__wbg_crypto_c48a774b022d20ac */ .Sc,
		"__wbg_process_298734cf255a885d": WEBPACK_IMPORTED_MODULE_0/* .__wbg_process_298734cf255a885d */ .Vb,
		"__wbg_versions_e2e78e134e3e5d01": WEBPACK_IMPORTED_MODULE_0/* .__wbg_versions_e2e78e134e3e5d01 */ .cU,
		"__wbg_node_1cd7a5d853dbea79": WEBPACK_IMPORTED_MODULE_0/* .__wbg_node_1cd7a5d853dbea79 */ .Bj,
		"__wbindgen_is_string": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_is_string */ .eY,
		"__wbg_require_8f08ceecec0f4fee": WEBPACK_IMPORTED_MODULE_0/* .__wbg_require_8f08ceecec0f4fee */ .Wc,
		"__wbindgen_is_function": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_is_function */ .o$,
		"__wbg_msCrypto_bcb970640f50a1e8": WEBPACK_IMPORTED_MODULE_0/* .__wbg_msCrypto_bcb970640f50a1e8 */ .gj,
		"__wbg_newwithlength_e5d69174d6984cd7": WEBPACK_IMPORTED_MODULE_0/* .__wbg_newwithlength_e5d69174d6984cd7 */ .CN,
		"__wbg_self_1ff1d729e9aae938": WEBPACK_IMPORTED_MODULE_0/* .__wbg_self_1ff1d729e9aae938 */ .ey,
		"__wbg_window_5f4faef6c12b79ec": WEBPACK_IMPORTED_MODULE_0/* .__wbg_window_5f4faef6c12b79ec */ .Qz,
		"__wbg_globalThis_1d39714405582d3c": WEBPACK_IMPORTED_MODULE_0/* .__wbg_globalThis_1d39714405582d3c */ .E$,
		"__wbg_global_651f05c6a0944d1c": WEBPACK_IMPORTED_MODULE_0/* .__wbg_global_651f05c6a0944d1c */ .c7,
		"__wbindgen_is_undefined": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_is_undefined */ .XP,
		"__wbg_newnoargs_581967eacc0e2604": WEBPACK_IMPORTED_MODULE_0/* .__wbg_newnoargs_581967eacc0e2604 */ .$3,
		"__wbg_call_cb65541d95d71282": WEBPACK_IMPORTED_MODULE_0/* .__wbg_call_cb65541d95d71282 */ .Od,
		"__wbg_call_01734de55d61e11d": WEBPACK_IMPORTED_MODULE_0/* .__wbg_call_01734de55d61e11d */ .Nl,
		"__wbg_set_5cf90238115182c3": WEBPACK_IMPORTED_MODULE_0/* .__wbg_set_5cf90238115182c3 */ .H6,
		"__wbg_randomFillSync_dc1e9a60c158336d": WEBPACK_IMPORTED_MODULE_0/* .__wbg_randomFillSync_dc1e9a60c158336d */ .F,
		"__wbg_subarray_13db269f57aa838d": WEBPACK_IMPORTED_MODULE_0/* .__wbg_subarray_13db269f57aa838d */ .PY,
		"__wbg_getRandomValues_37fa2ca9e4e07fab": WEBPACK_IMPORTED_MODULE_0/* .__wbg_getRandomValues_37fa2ca9e4e07fab */ .TE,
		"__wbindgen_debug_string": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_debug_string */ .fY,
		"__wbindgen_throw": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_throw */ .Or,
		"__wbindgen_cb_drop": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_cb_drop */ .G6,
		"__wbg_then_f7e06ee3c11698eb": WEBPACK_IMPORTED_MODULE_0/* .__wbg_then_f7e06ee3c11698eb */ .vv,
		"__wbg_resolve_53698b95aaf7fcf8": WEBPACK_IMPORTED_MODULE_0/* .__wbg_resolve_53698b95aaf7fcf8 */ .ot,
		"__wbindgen_closure_wrapper4248": WEBPACK_IMPORTED_MODULE_0/* .__wbindgen_closure_wrapper4248 */ .j1
	}
});

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && !queue.d) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = 1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/harmony module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.hmd = (module) => {
/******/ 			module = Object.create(module);
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'exports', {
/******/ 				enumerable: true,
/******/ 				set: () => {
/******/ 					throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 				}
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/wasm loading */
/******/ 	(() => {
/******/ 		__webpack_require__.v = (exports, wasmModuleId, wasmModuleHash, importsObj) => {
/******/ 			var req = fetch(__webpack_require__.p + "" + wasmModuleHash + ".module.wasm");
/******/ 			if (typeof WebAssembly.instantiateStreaming === 'function') {
/******/ 				return WebAssembly.instantiateStreaming(req, importsObj)
/******/ 					.then((res) => (Object.assign(exports, res.instance.exports)));
/******/ 			}
/******/ 			return req
/******/ 				.then((x) => (x.arrayBuffer()))
/******/ 				.then((bytes) => (WebAssembly.instantiate(bytes, importsObj)))
/******/ 				.then((res) => (Object.assign(exports, res.instance.exports)));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(9459);
/******/ 	
/******/ })()
;