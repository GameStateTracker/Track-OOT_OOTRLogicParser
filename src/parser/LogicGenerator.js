
import path from "path";
import JSONCFile from "../utils/JSONCFile.js";
import postCalculateMethod from "./postCaclulate/postCalculate.js";
import {
    translateRegionName,
    translateLocationName,
    translateEventName,
    translateMixinName,
    translateFunctionName
} from "../utils/TranslatorFunctions.js";
import NameTranslations from "../utils/translation/NameTranslations.js";
import StateTranslations from "../utils/translation/StateTranslations.js";
import ValueTranslations from "../utils/translation/ValueTranslations.js";
import StringIndexer from "../utils/StringIndexer.js";

const __dirname = path.resolve();

const generator_config = JSONCFile.read(path.join(__dirname, "/translation/generator_config.jsonc"), {});
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

const exitIndexer = new StringIndexer();
const locationIndexer = new StringIndexer();
const eventIndexer = new StringIndexer();

const missingState = new Map();
const missingValue = new Set();
const missingLocation = new Set();

function xor(a, b) {
    return !a != !b;
}

function postCalcutate(input, age = "", region = "", basic = false) {
    const scope = {
        mixins,
        missingState,
        missingValue
    };
    return postCalculateMethod(scope, input, age, region, basic);
}

function wrapEraFilter(rule, value) {
    if (value) {
        return {
            "type": "and",
            "content": [
                {
                    "type": "mixin",
                    "content": "mixin[filter_era]{" + value + "}"
                },
                rule
            ]
        };
    }
    return rule;
}

class LogicGenerator {

    reset() {
        structure = {};
        missingState.clear();
        missingValue.clear();
        missingLocation.clear();
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
        const name = exitIndexer.apply(key);
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
        const name = locationIndexer.apply(key);
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
        const name = eventIndexer.apply(key);
        structure[region].events.push(name);
        events.set(name, value);
    }

    generate(glitched = false) {
        console.log("");
        console.log("-------------------------------------------");
        console.log("generate logic output");
        console.log("");

        for (const key in function_overrides) {
            if (key == "") {
                continue;
            }
            functions.set(key, function_overrides[key]);
            //console.log(`added function override: ${key}`);
        }
        for (const key in mixin_overrides) {
            if (key == "") {
                continue;
            }
            mixins.set(translateMixinName(key), mixin_overrides[key]);
            //console.log(`added mixin override: ${key}`);
        }
        for (const key in event_overrides) {
            if (key == "") {
                continue;
            }
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
                const nodeName = StringIndexer.remove(node);
                const name = translateRegionName(nodeName);
                const basicGeneration = generator_config["useBasicGeneration"]?.["exits"];
                const wrapNotEra = generator_config["wrapNotEra"]?.["exits"];
                const basicGenerationChild = xor(basicGeneration["default"], (basicGeneration["child"] ?? []).includes(name));
                const basicGenerationAdult = xor(basicGeneration["default"], (basicGeneration["adult"] ?? []).includes(name));
                const wrapNotEraChild = xor(wrapNotEra["default"], (wrapNotEra["child"] ?? []).includes(name)) && "child";
                const wrapNotEraAdult = xor(wrapNotEra["default"], (wrapNotEra["adult"] ?? []).includes(name)) && "adult";
                if (logic_overrides[regName]?.[name] != null) {
                    regC[`${name}{child}`] = wrapEraFilter(postCalcutate(logic_overrides[regName][name], "child", regName), wrapNotEraChild);
                    regA[`${name}{adult}`] = wrapEraFilter(postCalcutate(logic_overrides[regName][name], "adult", regName), wrapNotEraAdult);
                } else {
                    regC[`${name}{child}`] = wrapEraFilter(postCalcutate(exits.get(node), "child", regName, basicGenerationChild), wrapNotEraChild);
                    regA[`${name}{adult}`] = wrapEraFilter(postCalcutate(exits.get(node), "adult", regName, basicGenerationAdult), wrapNotEraAdult);
                }
            }
            for (const node of data.locations) {
                const nodeName = StringIndexer.remove(node);
                const name = translateLocationName(nodeName);
                if (name == null) {
                    missingLocation.add(nodeName);
                    continue;
                }
                const basicGeneration = generator_config["useBasicGeneration"]?.["locations"];
                const wrapNotEra = generator_config["wrapNotEra"]?.["locations"];
                const basicGenerationChild = xor(basicGeneration["default"], (basicGeneration["child"] ?? []).includes(name));
                const basicGenerationAdult = xor(basicGeneration["default"], (basicGeneration["adult"] ?? []).includes(name));
                const wrapNotEraChild = xor(wrapNotEra["default"], (wrapNotEra["child"] ?? []).includes(name)) && "child";
                const wrapNotEraAdult = xor(wrapNotEra["default"], (wrapNotEra["adult"] ?? []).includes(name)) && "adult";
                if (logic_overrides[regName]?.[name] != null) {
                    regC[name] = wrapEraFilter(postCalcutate(logic_overrides[regName][name], "child", regName), wrapNotEraChild);
                    regA[name] = wrapEraFilter(postCalcutate(logic_overrides[regName][name], "adult", regName), wrapNotEraAdult);
                } else {
                    regC[name] = wrapEraFilter(postCalcutate(locations.get(node), "child", regName, basicGenerationChild), wrapNotEraChild);
                    regA[name] = wrapEraFilter(postCalcutate(locations.get(node), "adult", regName, basicGenerationAdult), wrapNotEraAdult);
                }
            }
            for (const node of data.events) {
                const nodeName = StringIndexer.remove(node);
                const name = translateEventName(nodeName);
                const basicGeneration = generator_config["useBasicGeneration"]?.["events"];
                const wrapNotEra = generator_config["wrapNotEra"]?.["events"];
                const basicGenerationChild = xor(basicGeneration["default"], (basicGeneration["child"] ?? []).includes(name));
                const basicGenerationAdult = xor(basicGeneration["default"], (basicGeneration["adult"] ?? []).includes(name));
                const wrapNotEraChild = xor(wrapNotEra["default"], (wrapNotEra["child"] ?? []).includes(name)) && "child";
                const wrapNotEraAdult = xor(wrapNotEra["default"], (wrapNotEra["adult"] ?? []).includes(name)) && "adult";
                if (logic_overrides[regName]?.[name] != null) {
                    regC[name] = wrapEraFilter(postCalcutate(logic_overrides[regName][name], "child", regName), wrapNotEraChild);
                    regA[name] = wrapEraFilter(postCalcutate(logic_overrides[regName][name], "adult", regName), wrapNotEraAdult);
                } else {
                    regC[name] = wrapEraFilter(postCalcutate(events.get(node), "child", regName, basicGenerationChild), wrapNotEraChild);
                    regA[name] = wrapEraFilter(postCalcutate(events.get(node), "adult", regName, basicGenerationAdult), wrapNotEraAdult);
                }
            }
            res.edges[`${regName}{child}`] = regC;
            res.edges[`${regName}{adult}`] = regA;
        }
        // mixins
        for (const [key, value] of mixins) {
            res.logic[`${key}{child}`] = postCalcutate(value, "child");
            res.logic[`${key}{adult}`] = postCalcutate(value, "adult");
        }
        // functions
        for (const [key, value] of functions) {
            res.logic[`${key}{child}`] = postCalcutate(value, "child");
            res.logic[`${key}{adult}`] = postCalcutate(value, "adult");
        }

        // BEGIN overrides
        res.edges["region[root]"] = {
            "region[root]{child}": {
                "type": "state",
                "content": "option[starting_age]",
                "value": "child"
            },
            "region[root]{adult}": {
                "type": "state",
                "content": "option[starting_age]",
                "value": "adult"
            }
        };
        res.edges["region[beyond_door_of_time]{child}"]["region[root_exits]{adult}"] = {
            "type": "true"
        };
        res.edges["region[beyond_door_of_time]{adult}"]["region[root_exits]{child}"] = {
            "type": "true"
        };
        res.edges["region[beyond_door_of_time]{child}"]["region[beyond_door_of_time]{adult}"] = {
            "type": "true"
        };
        res.edges["region[beyond_door_of_time]{adult}"]["region[beyond_door_of_time]{child}"] = {
            "type": "true"
        };
        res.logic["mixin[is_glitched]{child}"] = {
            "type": `${glitched}`
        }
        res.logic["mixin[is_glitched]{adult}"] = {
            "type": `${glitched}`
        }
        // END overrides

        console.log("");
        console.log("-------------------------------------------");
        console.log("locations not converted");
        console.log("");
        for (const name of missingLocation) {
            console.log(name);
        }

        console.log("");
        console.log("-------------------------------------------");
        console.log("values not converted");
        console.log("");
        for (const name of missingValue) {
            console.log(name);
        }

        console.log("");
        console.log("-------------------------------------------");
        console.log("states not converted");
        console.log("");
        for (const [name, state] of missingState) {
            console.log(`${name}:`, JSON.stringify(state, null, 4));
        }

        console.log("");
        console.log("-------------------------------------------");
        console.log("unused name translations");
        console.log("");
        for (const name of NameTranslations.getUnusedKeys()) {
            console.log(name);
        }
        NameTranslations.reset();

        console.log("");
        console.log("-------------------------------------------");
        console.log("unused value translations");
        console.log("");
        for (const name of ValueTranslations.getUnusedKeys()) {
            console.log(name);
        }
        ValueTranslations.reset();

        console.log("");
        console.log("-------------------------------------------");
        console.log("unused state translations");
        console.log("");
        for (const name of StateTranslations.getUnusedKeys()) {
            console.log(name);
        }
        StateTranslations.reset();

        return res;
    }

}

export default new LogicGenerator();
