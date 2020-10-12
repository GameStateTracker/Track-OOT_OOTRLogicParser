import fs from "fs";
import path from "path";
import JSONFile from "../utils/JSONFile.js";
import LogicGraph from "./LogicGraph.js";
import "./NodeFactory.js";

const __dirname = path.resolve();
const currentDir = path.join(__dirname, "src/_test/");

const LOGIC_PROCESSOR = new LogicGraph();
const savestate = JSONFile.read(`${currentDir}/savestate.json`);

function testChildLogic() {
    LOGIC_PROCESSOR.set("option.starting_age", "child");
    return LOGIC_PROCESSOR.traverse("region.root");
}

function testAdultLogic() {
    LOGIC_PROCESSOR.set("option.starting_age", "adult");
    return LOGIC_PROCESSOR.traverse("region.root");
}

export function testLogic(logic, prefix) {
    if (!prefix || typeof prefix != "string") {
        prefix = "";
    }
    LOGIC_PROCESSOR.load(logic);
    LOGIC_PROCESSOR.setAll(savestate.data);
    const edges = LOGIC_PROCESSOR.getEdges().map(e => e.join(" => "));
    const failed = new Set();
    const success = new Set();
    const successC = testChildLogic();
    const successA = testAdultLogic();
    for (const edge of edges) {
        if (successC.has(edge) || successA.has(edge)) {
            success.add(edge);
        } else {
            failed.add(edge);
        }
    }
    const dataSuccess = JSON.stringify(Array.from(success), null, 4);
    const dataFailed = JSON.stringify(Array.from(failed), null, 4);
    fs.writeFileSync(`${currentDir}/${prefix}success.json`, dataSuccess);
    fs.writeFileSync(`${currentDir}/${prefix}failed.json`, dataFailed);
    return [success, failed];
}

export function filterLogic(logic, prefix) {
    const [success, failed] = testLogic(logic, prefix);
    const res = {edges: {}, logic: logic.logic};
    for (let name in logic.edges) {
        res[name] = {};
        let children = logic.edges[name];
        for (let child in children) {
            if (success.has(`${name} => ${child}`)) {
                res[name][child] = logic.edges[name][child];
            }
        }
    }
    return res;
}