const TRANSPILERS = {
    /* literals */
    "true":     (logic) => "1",
    "false":    (logic) => "0",
    "string":   (logic) => escape(logic.el),
    "number":   (logic) => toNumber(logic.el),
    "value":    (logic) => `(val("${escape(logic.el)}")||0)`,
    "pointer":  (logic) => `(val(val("${escape(logic.el)}")||"")||0)`,
    "state":    (logic) => `(val("${escape(logic.el)}")||"")=="${escape(logic.value)}"`,

    /* operators */
    "and":      (logic) => `${multiElementOperation(logic.el, "&&")}`,
    "nand":     (logic) => `!${multiElementOperation(logic.el, "&&")}`,
    "or":       (logic) => `${multiElementOperation(logic.el, "||")}`,
    "nor":      (logic) => `!${multiElementOperation(logic.el, "||")}`,
    "not":      (logic) => `!(${buildLogic(logic.el)})`,
    "xor":      (logic) => `${twoElementOperation(logic.el, "^")||1}`,
    "xnor":     (logic) => `!${twoElementOperation(logic.el, "^")||1}`,

    /* restrictors */
    "min":      (logic) => `(${buildLogic(logic.el)}>=${escape(logic.value, 0)})`,
    "max":      (logic) => `(${buildLogic(logic.el)}<=${escape(logic.value, 0)})`,

    /* comparators */
    "eq":       (logic) => twoElementOperation(logic.el, "=="),
    "neq":      (logic) => twoElementOperation(logic.el, "!="),
    "lt":       (logic) => twoElementOperation(logic.el, "<"),
    "lte":      (logic) => twoElementOperation(logic.el, "<="),
    "gt":       (logic) => twoElementOperation(logic.el, ">"),
    "gte":      (logic) => twoElementOperation(logic.el, ">="),

    /* math */
    "add":      (logic) => mathOperation(logic.el, "+"),
    "sub":      (logic) => mathOperation(logic.el, "-"),
    "mul":      (logic) => mathOperation(logic.el, "*"),
    "div":      (logic) => mathOperation(logic.el, "/"),
    "mod":      (logic) => mathOperation(logic.el, "%"),
    "pow":      (logic) => mathOperation(logic.el, "**"),

    /* special */
    "at":       (logic) => !!logic.el ? `((val("${escape(logic.node)}")||0)&&${buildLogic(logic.el)})` : `(val("${escape(logic.node)}")||0)`,
    "mixin":    (logic) => `execute("${escape(logic.el)}")`
};

let dependencies = null;

/* STRINGS */
function escape(str, def = "") {
    if (typeof str != "string") {
        if (typeof str == "number" && !isNaN(str)) {
            return str;
        }
        return def;
    }
    let res = str.replace(/[\\"]/g, "\\$&");
    dependencies.add(res);
    return res;
}

/* ELEMENTS */
function twoElementOperation(els, join) {
    if (els.length == 0) {
        return 0;
    }
    if (els.length == 1) {
        return buildLogic(els[0]);
    }
    return `(${buildLogic(els[0])}${join}${buildLogic(els[1])})`;
}

function multiElementOperation(els, join) {
    if (els.length == 0) {
        return 0;
    }
    if (els.length == 1) {
        return buildLogic(els[0]);
    }
    return `(${els.map(buildLogic).join(join)})`;
}

/* MATH */
function toNumber(val) {
    return `(parseInt(${val})||0)`
}

function mathOperation(els, join) {
    if (els.length == 0) {
        return 0;
    }
    if (els.length == 1) {
        return buildLogic(els[0]);
    }
    return `(parseInt(${els.map(buildLogic).map(toNumber).join(join)})||0)`;
}

/* INITIATOR */
function buildLogic(logic) {
    if (typeof logic != "object") {
        logic = {type: logic};
    }
    if (TRANSPILERS[logic.type] != null) {
        return TRANSPILERS[logic.type](logic);
    }
    return 0;
}

class Compiler {

    compile(logic) {
        dependencies = new Set();
        let buf = buildLogic(logic);
        let fn = new Function("val", "execute", `return ${buf}`);
        Object.defineProperty(fn, "requires", {value: dependencies});
        return fn;
    }

}

export default new Compiler;