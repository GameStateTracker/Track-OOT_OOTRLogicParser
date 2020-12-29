
import path from "path";
import JSONCFile from "../utils/JSONCFile.js";
import postCalculateMethod from "./postCaclulate/postCalculate.js";
import {
    INDEX_DELIMITER,
    translateRegionName,
    translateLocationName,
    translateEventName,
    translateMixinName,
    translateFunctionName
} from "../utils/TranslatorFunctions.js";

const __dirname = path.resolve();

const function_overrides = JSONCFile.read(path.join(__dirname, "/translation/functions.jsonc"), {});
const mixin_overrides = JSONCFile.read(path.join(__dirname, "/translation/mixins.jsonc"), {});
const event_overrides = JSONCFile.read(path.join(__dirname, "/translation/events.jsonc"), {});
const logic_overrides = JSONCFile.read(path.join(__dirname, "/translation/overrides.jsonc"), {});

const mixins = new Map();
const functions = new Map();
const exits = new Map();
const locations = new Map();
const events = new Map();
let structure = {};

const unstate = {};

function wrapNotEraFilter(rule, value) {
    return {
        "type": "and",
        "el": [
            {
                "type": "not",
                "el": {
                    "type": "state",
                    "el": "filter.era",
                    "value": value
                }
            },
            rule
        ]
    };
}

class LogicGenerator {

    reset() {
        structure = {};
    }

    addMixin(key, value) {
        mixins.set(translateMixinName(key), value);
    }

    addFunction(key, value) {
        functions.set(translateFunctionName(key), value);
    }

    addExit(region, key, value) {
        if (structure[region] == null) {
            structure[region] = {
                locations: [],
                exits: [],
                events: []
            };
        }
        let idx = 0;
        let name = `${key}${INDEX_DELIMITER}${idx}`
        while (exits.has(name)) {
            idx++;
            name = `${key}${INDEX_DELIMITER}${idx}`;
        }
        structure[region].exits.push(name);
        exits.set(name, value);
    }

    addLocation(region, key, value) {
        if (structure[region] == null) {
            structure[region] = {
                locations: [],
                exits: [],
                events: []
            };
        }
        let idx = 0;
        let name = `${key}${INDEX_DELIMITER}${idx}`
        while (locations.has(name)) {
            idx++;
            name = `${key}${INDEX_DELIMITER}${idx}`;
        }
        structure[region].locations.push(name);
        locations.set(name, value);
    }

    addEvent(region, key, value) {
        if (structure[region] == null) {
            structure[region] = {
                locations: [],
                exits: [],
                events: []
            };
        }
        let idx = 0;
        let name = `${key}${INDEX_DELIMITER}${idx}`
        while (events.has(name)) {
            name = `${key}${INDEX_DELIMITER}${++idx}`;
        }
        //console.log(name);
        structure[region].events.push(name);
        events.set(name, value);
    }

    generate(glitched = false) {
        console.log("");
        console.log("-------------------------------------------");
        console.log("generate logic output");
        console.log("");

        for (const key in function_overrides) {
            if (key == "") continue;
            functions.set(key, function_overrides[key]);
            //console.log(`added function override: ${key}`);
        }
        for (const key in mixin_overrides) {
            if (key == "") continue;
            mixins.set(translateMixinName(key), mixin_overrides[key]);
            //console.log(`added mixin override: ${key}`);
        }
        for (const key in event_overrides) {
            if (key == "") continue;
            events.set(key, event_overrides[key]);
            //console.log(`added event override: ${key}`);
        }

        const res = {
            edges: {},
            logic: {}
        };
        for (const region in structure) {
            const data = structure[region];
            const regC = {};
            const regA = {};
            const regName = translateRegionName(region);
            for (const node of data.exits) {
                const name = translateRegionName(node);
                if (logic_overrides[regName] != null && logic_overrides[regName][name] != null) {
                    regC[`${name}[child]`] = postCalcutate(logic_overrides[regName][name], "child", regName);
                    regA[`${name}[adult]`] = postCalcutate(logic_overrides[regName][name], "adult", regName);
                } else {
                    if (name === 'region.deku_tree_boss_room' || name === 'region.deku_tree_basement_water_room_back_mq' || name === 'region.deku_tree_basement_water_room_front_mq') {
                        regC[`${name}[child]`] = postCalcutate(exits.get(node), "child", regName, true);
                        regA[`${name}[adult]`] = postCalcutate(exits.get(node), "adult", regName);
                    } else {
                        regC[`${name}[child]`] = postCalcutate(exits.get(node), "child", regName);
                        regA[`${name}[adult]`] = postCalcutate(exits.get(node), "adult", regName);
                    }
                }
            }
            for (const node of data.locations) {
                const name = translateLocationName(node);
                if (logic_overrides[regName] != null && logic_overrides[regName][name] != null) {
                    regC[name] = wrapNotEraFilter(postCalcutate(logic_overrides[regName][name], "child", regName), "adult");
                    regA[name] = wrapNotEraFilter(postCalcutate(logic_overrides[regName][name], "adult", regName), "child");
                } else {
                    regC[name] = wrapNotEraFilter(postCalcutate(locations.get(node), "child", regName), "adult");
                    regA[name] = wrapNotEraFilter(postCalcutate(locations.get(node), "adult", regName), "child");
                }
            }
            for (const node of data.events) {
                const name = translateEventName(node);
                if (logic_overrides[regName] != null && logic_overrides[regName][name] != null) {
                    regC[name] = wrapNotEraFilter(postCalcutate(logic_overrides[regName][name], "child", regName), "adult");
                    regA[name] = wrapNotEraFilter(postCalcutate(logic_overrides[regName][name], "adult", regName), "child");
                } else {
                    if (name === "event.showed_mido_sword_&_shield" || name === "event.deku_tree_clear") {
                        regC[name] = postCalcutate(events.get(node), "child", regName, true);
                        regA[name] = postCalcutate(events.get(node), "adult", regName);
                    } else {
                        regC[name] = wrapNotEraFilter(postCalcutate(events.get(node), "child", regName), "adult");
                        regA[name] = wrapNotEraFilter(postCalcutate(events.get(node), "adult", regName), "child");
                    }
                }
            }
            res.edges[`${regName}[child]`] = regC;
            res.edges[`${regName}[adult]`] = regA;
        }
        // mixins
        for (const [key, value] of mixins) {
            res.logic[`${key}[child]`] = postCalcutate(value, "child");
            res.logic[`${key}[adult]`] = postCalcutate(value, "adult");
        }
        // functions
        for (const [key, value] of functions) {
            res.logic[`${key}[child]`] = postCalcutate(value, "child");
            res.logic[`${key}[adult]`] = postCalcutate(value, "adult");
        }

        // BEGIN overrides
        res.edges["region.root"] = {
            "region.root[child]": {
                "type": "state",
                "el": "option.starting_age",
                "value": "child"
            },
            "region.root[adult]": {
                "type": "state",
                "el": "option.starting_age",
                "value": "adult"
            }
        };
        res.edges["region.beyond_door_of_time[child]"]["region.root_exits[adult]"] = {
            "type": "true"
        };
        res.edges["region.beyond_door_of_time[adult]"]["region.root_exits[child]"] = {
            "type": "true"
        };
        res.logic["mixin.is_glitched[child]"] = {
            "type": `${glitched}`
        }
        res.logic["mixin.is_glitched[adult]"] = {
            "type": `${glitched}`
        }
        // END overrides


        console.log("");
        console.log("-------------------------------------------");
        console.log("states not converted");
        console.log("");
        console.log(JSON.stringify(unstate, null, 4));

        return res;
    }

}

function postCalcutate(input, age = "", region = "", basic = false) {
    const scope = {
        mixins,
        unstate
    };
    return postCalculateMethod(scope, input, age, region, basic);
}

export default new LogicGenerator();
