
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

const VERSION = 1;

const __dirname = path.resolve();

const generator_config = JSONCFile.read(path.join(__dirname, "/translation/generator_config.jsonc"), {});
const function_overrides = JSONCFile.read(path.join(__dirname, "/translation/functions.jsonc"), {});
const mixin_overrides = JSONCFile.read(path.join(__dirname, "/translation/mixins.jsonc"), {});
const event_overrides = JSONCFile.read(path.join(__dirname, "/translation/events.jsonc"), {});
const exit_overrides = JSONCFile.read(path.join(__dirname, "/translation/exits.jsonc"), {});
const logic_overrides = JSONCFile.read(path.join(__dirname, "/translation/overrides.jsonc"), {});

const mixins = new Map();
const functions = new Map();
const exits = new Map();
const locations = new Map();
const events = new Map();
let structure = {};

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
        const name = `${region} => ${key}`;
        structure[region].exits.push(key);
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
        const name = `${region} => ${key}`;
        structure[region].locations.push(key);
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
        const name = `${region} => ${key}`;
        structure[region].events.push(key);
        events.set(name, value);
    }

    generate(glitched = false) {
        console.log("");
        console.log("-------------------------------------------");
        console.log("generate logic output");
        console.log("");

        for (const region in exit_overrides) {
            if (region == "") {
                continue;
            }
            const target_overrides = exit_overrides[region];
            for (const key in target_overrides) {
                if (key == "") {
                    continue;
                }
                const value = target_overrides[key];
                this.addExit(region, key, value);
                console.log(`added exit override: ${region} => ${key}`);
            }
        }
        for (const region in event_overrides) {
            if (region == "") {
                continue;
            }
            const target_overrides = event_overrides[region];
            for (const key in target_overrides) {
                if (key == "") {
                    continue;
                }
                const value = target_overrides[key];
                this.addEvent(region, key, value);
            }
            //console.log(`added event override: ${key}`);
        }
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

        const res = {
            version: VERSION,
            edges: {},
            functions: {}
        };
        for (const region in structure) {
            const data = structure[region];
            const reg = {};
            const regName = translateRegionName(region);
            for (const nodeName of data.exits) {
                const exitId = `${region} => ${nodeName}`;
                const exitName = translateRegionName(nodeName);
                const basicGeneration = generator_config["useBasicGeneration"]?.["exits"];
                const overrideConfig = logic_overrides[regName]?.[exitName];
                if (overrideConfig != null) {
                    this.#addRegionTarget(reg, regName, exitName, overrideConfig, basicGeneration);
                } else {
                    const edgeConfig = exits.get(exitId);
                    if (edgeConfig != null) {
                        this.#addRegionTarget(reg, regName, exitName, edgeConfig, basicGeneration);
                    } else {
                        reg[exitName] = {
                            logic: {
                                type: "error"
                            }
                        };
                    }
                }
            }
            for (const nodeName of data.locations) {
                const locationId = `${region} => ${nodeName}`;
                const locationName = translateLocationName(nodeName);
                if (locationName == null) {
                    missingLocation.add(nodeName);
                    continue;
                }
                const basicGeneration = generator_config["useBasicGeneration"]?.["locations"];
                const overrideConfig = logic_overrides[regName]?.[locationName];
                if (overrideConfig != null) {
                    this.#addRegionTarget(reg, regName, locationName, overrideConfig, basicGeneration);
                } else {
                    const edgeConfig = locations.get(locationId);
                    if (edgeConfig != null) {
                        this.#addRegionTarget(reg, regName, locationName, edgeConfig, basicGeneration);
                    } else {
                        reg[locationName] = {
                            logic: {
                                type: "error"
                            }
                        };
                    }
                }
            }
            for (const nodeName of data.events) {
                const eventId = `${region} => ${nodeName}`;
                const eventName = translateEventName(nodeName);
                const basicGeneration = generator_config["useBasicGeneration"]?.["events"];
                const overrideConfig = logic_overrides[regName]?.[eventName];
                if (overrideConfig != null) {
                    this.#addRegionTarget(reg, regName, eventName, overrideConfig, basicGeneration);
                } else {
                    const edgeConfig = events.get(eventId);
                    if (edgeConfig != null) {
                        this.#addRegionTarget(reg, regName, eventName, edgeConfig, basicGeneration);
                    } else {
                        reg[eventName] = {
                            logic: {
                                type: "error"
                            }
                        };
                    }
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

    #addRegionTarget(regionMap, regionName, targetName, config, basicGeneration) {
        const {
            logic, dataMutation
        } = config;
        if (logic != null) {
            regionMap[targetName] = {
                logic: postCalcutate(logic, regionName, basicGeneration),
                dataMutation
            };
        } else {
            regionMap[targetName] = {
                logic: postCalcutate(config, regionName, basicGeneration)
            };
        }
    }

}

export default new LogicGenerator();
