import fs from "fs";
import path from "path";
import JSONFile from "../utils/JSONFile.js";
import LogicGraph from "./LogicGraph.js";

const __dirname = path.resolve();
const currentDir = path.join(__dirname, "src/_test/");

const LOGIC_PROCESSOR = new LogicGraph();
const savestate = JSONFile.read(`${currentDir}/savestate.json`);

// TODO better get edged one by one
// would make it possible to dynamically set starting age to target edges age

export function testLogic(logic) {
    LOGIC_PROCESSOR.load(logic);
    LOGIC_PROCESSOR.setAll(savestate.data);
    
    const res = LOGIC_PROCESSOR.traverse("region.root");

    const data = JSON.stringify(res, null, 4);
    fs.writeFileSync(`${currentDir}/output.json`, data);

    return res;
}