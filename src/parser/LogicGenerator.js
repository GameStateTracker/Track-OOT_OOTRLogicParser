
import path from "path";
import Translation from "../utils/Translation.js";
import JSONCFile from "../utils/JSONCFile.js";

const __dirname = path.resolve();

const function_overrides = JSONCFile.read(path.join(__dirname, "/translation/functions.jsonc"), {});
const mixin_overrides = JSONCFile.read(path.join(__dirname, "/translation/mixins.jsonc"), {});
const event_overrides = JSONCFile.read(path.join(__dirname, "/translation/events.jsonc"), {});
const logic_overrides = JSONCFile.read(path.join(__dirname, "/translation/overrides.jsonc"), {});

let mixins = new Map();
let functions = new Map();
let exits = new Map();
let locations = new Map();
let events = new Map();
let logicOverrides = new Map();
let structure = {};
let mixinsGlitched = new Map();
let functionsGlitched = new Map();
let exitsGlitched = new Map();
let locationsGlitched = new Map();
let eventsGlitched = new Map();
let logicOverridesGlitched = new Map();
let structureGlitched = {};

const unstate = {};

class LogicGenerator {

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
		while( exits.has(key)) {
			key = key + "1";
		}
        structure[region].exits.push(key);
        exits.set(key, value);
    }

    addLocation(region, key, value) {
        if (structure[region] == null) {
            structure[region] = {
                locations: [],
                exits: [],
                events: []
            };
        }
        structure[region].locations.push(key);
        locations.set(key, value);
    }

    addEvent(region, key, value) {
        if (structure[region] == null) {
            structure[region] = {
                locations: [],
                exits: [],
                events: []
            };
        }
        structure[region].events.push(key);
        events.set(key, value);
    }


    addMixinGlitched(key, value) {
        mixinsGlitched.set(translateMixinName(key), value);
    }

    addFunctionGlitched(key, value) {
        functionsGlitched.set(translateFunctionName(key), value);
    }

    addExitGlitched(region, key, value) {
        if (structureGlitched[region] == null) {
            structureGlitched[region] = {
                locations: [],
                exits: [],
                events: []
            };
        }
        while( exitsGlitched.has(key)) {
            key = key + "1";
        }
        structureGlitched[region].exits.push(key);
        exitsGlitched.set(key, value);
    }

    addLocationGlitched(region, key, value) {
        if (structureGlitched[region] == null) {
            structureGlitched[region] = {
                locations: [],
                exits: [],
                events: []
            };
        }
        structureGlitched[region].locations.push(key);
        locationsGlitched.set(key, value);
    }

    addEventGlitched(region, key, value) {
        if (structureGlitched[region] == null) {
            structureGlitched[region] = {
                locations: [],
                exits: [],
                events: []
            };
        }
        structureGlitched[region].events.push(key);
        eventsGlitched.set(key, value);
    }


    generate()  {

        console.log("");
        console.log("-------------------------------------------");
        console.log("generate logic output");
        console.log("");

        for (let key in function_overrides) {
            if (key == "") continue;
            functions.set(key, function_overrides[key]);
            console.log(`added function override: ${key}`);
        }
        for (let key in mixin_overrides) {
            if (key == "") continue;
            mixins.set(translateMixinName(key), mixin_overrides[key]);
            console.log(`added mixin override: ${key}`);
        }
        for (let key in event_overrides) {
            if (key == "") continue;
            events.set(key, event_overrides[key]);
            console.log(`added event override: ${key}`);
        }

        let res = {
            edges: {},
            logic: {}
        };
        for (let region in structure) {
            let data = structure[region];
            let reg = {};
            let regName = translateRegionName(region);
            for (let node of data.exits) {
                let name = translateRegionName(node);
                if (logic_overrides[regName] != null && logic_overrides[regName][name] != null) {
                    reg[name] = logic_overrides[regName][name];
                } else {
                    reg[name] = postCalcutate(exits.get(node));
                }
            }
            for (let node of data.locations) {
                let name = `logic.${Translation.translateName(node)}`;
                if (logic_overrides[regName] != null && logic_overrides[regName][name] != null) {
                    reg[name] = logic_overrides[regName][name];
                } else {
                    reg[name] = postCalcutate(locations.get(node));
                }
            }
            for (let node of data.events) {
                let name = translateEventName(node);
                if (logic_overrides[regName] != null && logic_overrides[regName][name] != null) {
                    reg[name] = logic_overrides[regName][name];
                } else {
                    reg[name] = postCalcutate(events.get(node));
                }
            }
            res.edges[regName] = reg;
        }
        // mixins
        for (var [key, value] of mixins) {
            res.logic[key] = postCalcutate(value);
        }
        // functions
        for (var [key, value] of functions) {
            res.logic[key] = postCalcutate(value);
        }
        
        console.log("");
        console.log("-------------------------------------------");
        console.log("states not converted");
        console.log("");
        console.log(JSON.stringify(unstate, null, 4));

        return res;
    }

    generateGlitched()  {

        console.log("");
        console.log("-------------------------------------------");
        console.log("generate glitched logic output");
        console.log("");

        for (let key in function_overrides) {
            if (key == "") continue;
            functions.set(key, function_overrides[key]);
            console.log(`added function override: ${key}`);
        }
        for (let key in mixin_overrides) {
            if (key == "") continue;
            mixins.set(translateMixinName(key), mixin_overrides[key]);
            console.log(`added mixin override: ${key}`);
        }
        for (let key in event_overrides) {
            if (key == "") continue;
            events.set(key, event_overrides[key]);
            console.log(`added event override: ${key}`);
        }

        let res = {
            edges: {},
            logic: {}
        };
        for (let region in structureGlitched) {
            let data = structureGlitched[region];
            let reg = {};
            let regName = translateRegionName(region);
            for (let node of data.exits) {
                let name = translateRegionName(node);
                if (logic_overrides[regName] != null && logic_overrides[regName][name] != null) {
                    reg[name] = logic_overrides[regName][name];
                } else {
                    reg[name] = postCalcutate(exitsGlitched.get(node));
                }
            }
            for (let node of data.locations) {
                let name = `logic.${Translation.translateName(node)}`;
                if (logic_overrides[regName] != null && logic_overrides[regName][name] != null) {
                    reg[name] = logic_overrides[regName][name];
                } else {
                    reg[name] = postCalcutate(locationsGlitched.get(node));
                }
            }
            for (let node of data.events) {
                let name = translateEventName(node);
                if (logic_overrides[regName] != null && logic_overrides[regName][name] != null) {
                    reg[name] = logic_overrides[regName][name];
                } else {
                    reg[name] = postCalcutate(eventsGlitched.get(node));
                }
            }
            res.edges[regName] = reg;
        }
        // mixins
        for (var [key, value] of mixinsGlitched) {
            res.logic[key] = postCalcutate(value);
        }
        // functions
        for (var [key, value] of functionsGlitched) {
            res.logic[key] = postCalcutate(value);
        }
        
        console.log("");
        console.log("-------------------------------------------");
        console.log("states not converted");
        console.log("");
        console.log(JSON.stringify(unstate, null, 4));

        return res;
    }

}

function postCalcutate(input)  {
    let els = [];
	//console.log(input);
    switch(input.type) {
        case "value":
            if (input.el.startsWith("item.") || input.el.startsWith("region.") || input.el.startsWith("mixin.") || input.el.startsWith("function.")) {
                return input;
            }
            let res = Translation.getValueName(input.el);
            if (res != null) {
                return res;
            }
            let mixname = translateMixinName(input.el);
            if (mixins.has(mixname)) {
                return {
                    type: "mixin",
                    el: mixname
                };
            }
            if (input.el.indexOf(".") < 0) {
                console.log(`no translation: ${input.el}`);
            }
            return input;
        case "state":
            let stapar = input.value.replace(/^'|'$/g, "");
            let sta = Translation.getStateConfig(input.el);
            if (sta == null) {
                unstate[input.el] = unstate[input.el] || {
                    name: "",
                    values: {}
                };
                unstate[input.el].values[stapar] = "";
                return {
                    type: "state",
                    el: input.el,
                    value: stapar
                };
            } else {
                return {
                    type: "state",
                    el: sta.name,
                    value: sta.values[stapar]
                };
            }
        case "function":
            let fnName = translateFunctionName(input.value);
            let param = input.el[0];
            if (param != null) {
                param = param.el
                let paramBuff = Translation.getValueName(param);
                if (paramBuff != null) {
                    param = paramBuff.el;
                } 
                fnName = `${fnName}(${param})`;
            }
            return {
                type: "mixin",
                el: fnName
            };
        case "at":
            return {
                type: "at",
                node: translateRegionName(input.node),
                el: postCalcutate(input.el)
            };
        case "here":
            return {
                type: "here",
                el: postCalcutate(input.el)
            };
        case "and":
        case "nand":
        case "or":
        case "nor":
        case "xor":
        case "xnor":
            for (let el of input.el) {
                els.push(postCalcutate(el));
            }
            return {
                type: input.type,
                el: els
            };
        case "min":
        case "max":
                let buffer = parseInt(input.value);
                if (isNaN(buffer)) {
                    return {
                        type: input.type == "min" ? "lte" : "gte",
                        el: postCalcutate(input.el),
                        value: input.value.replace(/^'|'$/g, "")
                    };
                }
                return {
                    type: input.type,
                    el: postCalcutate(input.el),
                    value: buffer
                };
        case "not":
            return {
                type: "not",
                el: postCalcutate(input.el)
            };
        default:
            return input;
    }
}

function translateRegionName(input) {
    if (input.startsWith("region.")) return input;
    return `region.${input.toLowerCase().replace(/ /g, "_").replace(/1/g, "")}`;
}

function translateEventName(input) {
    if(input.startsWith("event.")) return input;
    return `event.${input.toLowerCase().replace(/ /g, "_")}`;
}

function translateMixinName(input) {
    if (input.startsWith("mixin.")) return input;
    return `mixin.${input.toLowerCase().replace(/ /g, "_")}`;
}

function translateFunctionName(input) {
    if (input.startsWith("function.")) return input;
    return `function.${input.toLowerCase().replace(/ /g, "_")}`;
}

export default new LogicGenerator();