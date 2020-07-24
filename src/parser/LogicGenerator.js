
import path from "path";
import Translation from "../utils/Translation.js";
import JSONCFile from "../utils/JSONCFile.js";

const __dirname = path.resolve();

const function_overrides = JSONCFile.read(path.join(__dirname, "/translation/functions.jsonc"), {});
const mixin_overrides = JSONCFile.read(path.join(__dirname, "/translation/mixins.jsonc"), {});
const event_overrides = JSONCFile.read(path.join(__dirname, "/translation/events.jsonc"), {});

let mixins = new Map();
let functions = new Map();
let exits = new Map();
let locations = new Map();
let events = new Map();
let structure = {};

let used_mixins = new Set();
let used_functions = new Set();
let used_events = new Set();

let written_mixins = new Set();
let written_functions = new Set();
let written_events = new Set();

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
            mixins.set(key, mixin_overrides[key]);
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
            for (let node of data.exits) {
                reg[translateRegionName(node)] = postCalcutate(exits.get(node));
            }
            for (let node of data.locations) {
                reg[`logic.${Translation.translateName(node)}`] = postCalcutate(locations.get(node));
            }
            for (let node of data.events) {
                reg[translateEventName(node)] = postCalcutate(events.get(node));
            }
            res.edges[translateRegionName(region)] = reg;
        }
        while (!!used_mixins.size || !!used_functions.size || !!used_events.size) {
            // mixins
            let mixinArr = Array.from(used_mixins);
            used_mixins.clear();
            while (!!mixinArr.length) {
                let key = mixinArr.pop();
                if (!written_mixins.has(key)) {
                    written_mixins.add(key);
                    let value = mixins.get(key);
                    res.logic[key] = postCalcutate(value);
                }
            }
            // functions
            let functionArr = Array.from(used_functions);
            used_functions.clear();
            while (!!functionArr.length) {
                let key = functionArr.pop();
                if (!written_functions.has(key)) {
                    written_functions.add(key);
                    let value = functions.get(key);
                    res.logic[key] = postCalcutate(value);
                }
            }
            // events
            let eventArr = Array.from(used_events);
            used_events.clear();
            while (!!eventArr.length) {
                let key = eventArr.pop();
                if(!written_events.has(key)) {
                    written_events.add(key);
                    let value = events.get(key);
                    res.edges[key] = postCalcutate(value);
                }
            }
        }
        
        console.log("");
        console.log("-------------------------------------------");
        console.log("states not converted");
        console.log("");
        console.log(JSON.stringify(unstate, null, 4));

        return res;
    }

}

function findMixins(input) {
    switch (input.type) {
        case "true":
        case "false":
        case "state":
            return;
        case "value":
            if (mixins.has(input.el)) {
                if (!used_mixins.has(input.el)) {
                    used_mixins.add(input.el);
                    console.log(`used mixin    : ${input.el}`);
                }
            }
            return;
        case "min":
        case "max":
        case "not":
            findMixins(input.el);
            return;
        default:
            for (let el of input.el) {
                findMixins(el);
            }
            return;
    }
}

function postCalcutate(input)  {
    let els = [];
	//console.log(input);
    switch(input.type) {
        case "value":
            if (input.el.startsWith("item.") || input.el.startsWith("mixin.") || input.el.startsWith("function.") || input.el.startsWith("region.")) {
                return input;
            }
            let res = Translation.getValueName(input.el);
            if (res != null) {
                findMixins(res);
                return res;
            }
            let mixname = translateMixinName(input.el);
            if (mixins.has(mixname)) {
                if (!used_mixins.has(mixname)) {
                    used_mixins.add(mixname);
                    console.log(`used mixin    : ${mixname}`);
                }
                return {
                    type: "value",
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
            if (!used_functions.has(fnName)) {
                used_functions.add(fnName);
                console.log(`used function : ${fnName}`);
            }
            return {
                type: "value",
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