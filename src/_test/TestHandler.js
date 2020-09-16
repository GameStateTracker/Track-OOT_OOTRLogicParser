import LogicGraph from "./LogicGraph.js";
import Compiler from "./EdgeLogicCompiler.js";

const LOGIC_PROCESSOR = new LogicGraph();

function execute() {
    return 1;
}

function getter(mem, key) {
    const buf = new Map(Object.entries(mem));
    if (buf.has(key)) {
        return buf.get(key);
    }
}

export function testLogic(logic, data, root) {
    LOGIC_PROCESSOR.load(logic);
    LOGIC_PROCESSOR.setAll(data);
    return LOGIC_PROCESSOR.traverse(root);
}

export function testEdge(logic, data) {
    let fn = Compiler.compile(logic);
    const valueGetter = getter.bind(data);
    return fn(valueGetter, execute);
}