
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

const VERSION = 1;

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

function postCalcutate(input, region = "", basic = false) {
    const scope = {
        mixins,
        missingState,
        missingValue
    };
    return postCalculateMethod(scope, input, region, basic);
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
            // functions.set(translateFunctionName(key), function_overrides[key]);
            //console.log(`added function override: ${key}`);
        }
        for (const key in mixin_overrides) {
            if (key == "") {
                continue;
            }
            // mixins.set(translateMixinName(key), mixin_overrides[key]);
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
            version: VERSION,
            edges: {},
            functions: {}
        };
        for (const region in structure) {
            const data = structure[region];
            const reg = {};
            const regName = translateRegionName(region);
            for (const node of data.exits) {
                const nodeName = StringIndexer.remove(node);
                const name = translateRegionName(nodeName);
                const basicGeneration = generator_config["useBasicGeneration"]?.["exits"];
                if (logic_overrides[regName]?.[name] != null) {
                    reg[name] = {
                        logic: postCalcutate(logic_overrides[regName][name], regName)
                    };
                } else {
                    reg[name] = {
                        logic: postCalcutate(exits.get(node), regName, basicGeneration)
                    };
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
                if (logic_overrides[regName]?.[name] != null) {
                    reg[name] = {
                        logic: postCalcutate(logic_overrides[regName][name], regName)
                    };
                } else {
                    reg[name] = {
                        logic: postCalcutate(locations.get(node), regName, basicGeneration)
                    };
                }
            }
            for (const node of data.events) {
                const nodeName = StringIndexer.remove(node);
                const name = translateEventName(nodeName);
                const basicGeneration = generator_config["useBasicGeneration"]?.["events"];
                if (logic_overrides[regName]?.[name] != null) {
                    reg[name] = {
                        logic: postCalcutate(logic_overrides[regName][name], regName)
                    };
                } else {
                    reg[name] = {
                        logic: postCalcutate(events.get(node), regName, basicGeneration)
                    };
                }
            }
            res.edges[regName] = reg;
        }
        // mixins
        for (const [key, value] of mixins) {
            res.functions[key] = {
                logic: postCalcutate(value)
            };
        }
        // functions
        for (const [key, value] of functions) {
            const {
                logic, params
            } = value;
            res.functions[key] = {
                params,
                logic: postCalcutate(logic)
            };
        }

        // BEGIN overrides
        res.edges["region[travel_to_adult]"] = {
            ["region[root]"]: {
                "type": "true"
            }
        };
        res.edges["region[travel_to_child]"] = {
            ["region[root]"]: {
                "type": "true"
            }
        };
        res.edges["region[beyond_door_of_time]"]["region[travel_to_adult]"] = {
            logic: {
                "type": "and",
                "content": [
                    {
                        "type": "value",
                        "ref": "flag[time_travel]"
                    },
                    {
                        "type": "data",
                        "ref": "age",
                        "value": "child"
                    }
                ]
            },
            dataMutation: {
                "era": "adult"
            }
        };
        res.edges["region[beyond_door_of_time]"]["region[travel_to_child]"] = {
            logic: {
                "type": "and",
                "content": [
                    {
                        "type": "value",
                        "ref": "flag[time_travel]"
                    },
                    {
                        "type": "data",
                        "ref": "age",
                        "value": "adult"
                    }
                ]
            },
            dataMutation: {
                "era": "child"
            }
        };
        res.functions["mixin[is_glitched]"] = {
            "type": `${glitched}`
        };
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
