import path from "path";
import JSONFile from "../utils/JSONFile.js";
import LogicGraph from "./LogicGraph.js";
import "./NodeFactory.js";

const __dirname = path.resolve();
const currentDir = path.join(__dirname, "src/_test/");

const LOGIC_PROCESSOR = new LogicGraph();
const savestate = JSONFile.read(`${currentDir}/savestate.json`);

/* LOGIC */
function testChildLogic() {
    LOGIC_PROCESSOR.set("option.starting_age", "child");
    return LOGIC_PROCESSOR.executeEdges();
}

function testAdultLogic() {
    LOGIC_PROCESSOR.set("option.starting_age", "adult");
    return LOGIC_PROCESSOR.executeEdges();
}

function removeEmpty(obj, topLevel, mixins, child, adult)  {
    const newObj = {};

    Object.keys(obj).forEach(key => {
        if(mixins.has(obj[key]) || (child.has(obj[key]) && topLevel.endsWith("[child]")) || (adult.has(obj[key]) && topLevel.endsWith("[adult]"))) {
            delete obj["type"];
            delete obj[key];
            delete obj["value"]
        }
        if (obj[key] && typeof obj[key] === "object") {
            newObj[key] = removeEmpty(obj[key], topLevel, mixins, child, adult); // recurse
        } else if (obj[key] != null) {
            newObj[key] = obj[key]; // copy value
        }
    });

    return newObj;
}


export function filterFailedMixins(data) {
    let [logic, mixins] = data;
    let res = logic;
    let c = new Set(['item.hookshot', 'item.bow', 'item.hammer', 'item.cojiro', 'item.arrow_fire',
        'item.arrow_ice', 'item.arrow_light', 'item.sword_biggoron', 'item.shield_mirror', 'item.tunic_fire',
        'item.tunic_water', 'item.boots_iron', 'item.boots_hover']);
    let a = new Set(['item.boomerang', 'item.stick', 'item.slingshot', 'item.sword_kokiri', 'item.shield_kokiri']);

    for(const topLevel in res.edges) {
        let layerOne = res.edges[topLevel]

        removeEmpty(layerOne, topLevel, mixins, c, a);
        res.edges[topLevel] = layerOne;
    }

    return res
}

export function testLogic(logic) {
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
    return [success, failed];
}

export function filterLogic(data) {
    const [logic, mixinF] = data;
    const [success] = testLogic(filterFailedMixins(data));
    const res = {edges: {}, logic: logic.logic};
    for (const name in logic.edges) {
        const region = {};
        const children = logic.edges[name];
        for (const child in children) {
            if (success.has(`${name} => ${child}`)) {
                region[child] = logic.edges[name][child];
            }
        }
        if (Object.keys(region).length) {
            res.edges[name] = region;
        }
    }
    return res;
}

/* MIXINS */
function testChildMixins() {
    LOGIC_PROCESSOR.set("option.starting_age", "child");
    return LOGIC_PROCESSOR.executeMixins();
}

function testAdultMixins() {
    LOGIC_PROCESSOR.set("option.starting_age", "adult");
    return LOGIC_PROCESSOR.executeMixins();
}

export function testMixins(logic) {
    LOGIC_PROCESSOR.load(logic);
    LOGIC_PROCESSOR.setAll(savestate.data);
    const mixins = LOGIC_PROCESSOR.getMixins();
    const failed = new Set();
    const success = new Set();
    const successC = testChildMixins();
    const successA = testAdultMixins();
    for (const name of mixins) {
        if (successC.has(name) || successA.has(name)) {
            success.add(name);
        } else {
            failed.add(name);
        }
    }
    return [success, failed];
}

export function filterMixins(logic) {
    const [success, failed] = testMixins(logic);
    const res = {edges: logic.edges, logic: {}};
    for (const name in logic.logic) {
        if (success.has(name)) {
            res.logic[name] = logic.logic[name];
        }
    }
    return [res, failed];
}
