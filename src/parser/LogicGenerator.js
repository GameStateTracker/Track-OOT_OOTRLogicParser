
import Translation from "../utils/Translation.js";

let mixin = new Map();
let functions = new Map();
let exits = new Map();
let locations = new Map();
let structure = {};

class LogicGenerator {

    addMixin(key, value) {
        mixin.set(key, value);
    }

    addFunction(key, value) {
        functions.set(key, value);
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
        mixin.forEach((value, key) => {
            res.mixins[translateMixinName(key)] = {
                category: "mixin",
                logic: postCalcutate(value)
            };
        });
        functions.forEach((value, key) => {
            //res.mixins[translateFunctionName(key)] = postCalcutate(value.logic);
            res.mixins[translateFunctionName(key)] = {
                category: "function",
                params: value.params,
                logic: postCalcutate(value.logic)
            };
        });
        return res;
    }

}

function postCalcutate(input)  {
    let els = [];
    switch(input.type) {
        case "value":
            let res = Translation.getOverride(input.el);
            if (res != null) {
                return res;
            }
            if (mixin.has(input.el)) {
                return {
                    type: "value",
                    el: translateMixinName(input.el)
                };
            }
            return input;
        case "state":
            return {
                type: "state",
                el: Translation.translateName(input.el, /^(option\.|skip\.)/),
                value: input.value.replace(/^'|'$/g, "")
            };
        case "function":
            return {
                type: "value",
                el: translateFunctionName(input.value)
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
            return {
                type: "state",
                el: postCalcutate(input.el)
            };
        default:
            return input;
    }
}

function translateRegionName(input) {
    return `region.${input.toLowerCase().replace(/ /g, "_")}`;
}

function translateMixinName(input) {
    return `mixin.${input.toLowerCase().replace(/ /g, "_")}`;
}

function translateFunctionName(input) {
    return `function.${input.toLowerCase().replace(/ /g, "_")}`;
}

export default new LogicGenerator();