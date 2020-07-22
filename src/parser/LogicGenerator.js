
import path from "path";
import Translation from "../utils/Translation.js";
import JSONCFile from "../utils/JSONCFile.js";

const __dirname = path.resolve();

const function_overrides = JSONCFile.read(path.join(__dirname, "/translation/functions.jsonc"), {});
const mixin_overrides = JSONCFile.read(path.join(__dirname, "/translation/mixin.jsonc"), {});

let mixins = new Map();
let functions = new Map();
let exits = new Map();
let locations = new Map();
let structure = {};

let used_mixins = new Set();
let used_functions = new Set();

let written_mixins = new Set();
let written_functions = new Set();

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
                exits: []
            };
        }
        structure[region].exits.push(key);
        exits.set(key, value);
    }

    addLocation(region, key, value) {
        if (structure[region] == null) {
            structure[region] = {
                locations: [],
                exits: []
            };
        }
        structure[region].locations.push(key);
        locations.set(key, value);
    }

    generate()  {

        console.log("");
        console.log("-------------------------------------------");
        console.log("generate logic output");
        console.log("");

        for (let key in function_overrides) {
            functions.set(key, function_overrides[key]);
        }
        for (let key in mixin_overrides) {
            mixins.set(key, mixin_overrides[key]);
        }

        let res = {
            edges: {},
            mixins: {}
        };
        for (let region in structure) {
            let data = structure[region];
            let reg = {};
            for (let node of data.exits) {
                reg[translateRegionName(node)] = {
                    category: "exit",
                    logic: postCalcutate(exits.get(node))
                };
            }
            for (let node of data.locations) {
                reg[Translation.translateName(node)] = {
                    category: "location",
                    logic: postCalcutate(locations.get(node))
                };
            }
            res.edges[translateRegionName(region)] = reg;
        }
        while (!!used_mixins.size || !!used_functions.size) {
            // mixins
            let mixinArr = Array.from(used_mixins);
            used_mixins.clear();
            while (!!mixinArr.length) {
                let key = mixinArr.pop();
                if (!written_mixins.has(key)) {
                    written_mixins.add(key);
                    let value = mixins.get(key);
                    //res.mixins[key] = postCalcutate(value);
                    res.mixins[key] = {
                        category: "mixin",
                        logic: postCalcutate(value)
                    };
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
                    //res.mixins[key] = postCalcutate(value);
                    console.log(key);
                    res.mixins[key] = {
                        category: "function",
                        logic: postCalcutate(value)
                    };
                }
            }
        }
        
        console.log("");
        console.log("-------------------------------------------");
        console.log("states not converted");
        console.log("");
        console.log(unstate);

        return res;
    }

}

function postCalcutate(input)  {
    let els = [];
    switch(input.type) {
        case "value":
            if (input.el.startsWith("item.") || input.el.startsWith("mixin.") || input.el.startsWith("function.") || input.el.startsWith("region.")) {
                return input;
            }
            let res = Translation.getValueName(input.el);
            if (res != null) {
                return res;
            }
            let mixname = translateMixinName(input.el);
            if (mixins.has(mixname)) {
                used_mixins.add(mixname);
                return {
                    type: "value",
                    el: mixname
                };
            }
            console.log(input);
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
            used_functions.add(fnName);
            return {
                type: "value",
                el: fnName
            };
        case "at":
            for (let el of input.el) {
                els.push(postCalcutate(el));
            }
            return {
                type: "at",
                node: translateRegionName(input.node),
                el: els
            };
        case "here":
            return {
                type: "here",
                el: [postCalcutate(input.el[0])]
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
            for (let el of input.el) {
                els.push(postCalcutate(el));
            }
            return {
                type: input.type,
                el: els
            };
        default:
            return input;
    }
}

function translateRegionName(input) {
    if (input.startsWith("region.")) return input;
    return `region.${input.toLowerCase().replace(/ /g, "_")}`;
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