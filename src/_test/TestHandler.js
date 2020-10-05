import LogicGraph from "./LogicGraph.js";

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

export function testLogic(logic, data) {
    LOGIC_PROCESSOR.load(logic);
    const edges = LOGIC_PROCESSOR.getEdges();
    const resTrv = [];
    const resNon = [];

    // TODO
    // traverse edges and return 2 arrays:
    // 1. all traversable edges
    // 2. all non traversable edges
    for (let [name, edge] of edges) {
        // TODO
    }

    return [resTrv, resNon];
}