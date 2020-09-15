
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
            //console.log(`added function override: ${key}`);
        }
        for (let key in mixin_overrides) {
            if (key == "") continue;
            mixins.set(translateMixinName(key), mixin_overrides[key]);
            //console.log(`added mixin override: ${key}`);
        }
        for (let key in event_overrides) {
            if (key == "") continue;
            events.set(key, event_overrides[key]);
            //console.log(`added event override: ${key}`);
        }

        let res = {
            edges: {},
            logic: {}
        };
        for (let region in structure) {
            let data = structure[region];
            let regC = {};
            let regA = {};
            let regName = translateRegionName(region);
            for (let node of data.exits) {
                let name = translateRegionName(node);
                if (logic_overrides[regName] != null && logic_overrides[regName][name] != null) {
                    regC[`${name}[child]`] = postCalcutate(logic_overrides[regName][name], "child", regName);
                    regA[`${name}[adult]`] = postCalcutate(logic_overrides[regName][name], "adult", regName);
                } else {
                    regC[`${name}[child]`] = postCalcutate(exits.get(node), "child", regName);
                    regA[`${name}[adult]`] = postCalcutate(exits.get(node), "adult", regName);
                }
            }
            for (let node of data.locations) {
                let name = `logic.${Translation.translateName(node)}`;
                if (logic_overrides[regName] != null && logic_overrides[regName][name] != null) {
                    regC[name] = wrapNotEraFilter(postCalcutate(logic_overrides[regName][name], "child", regName), "adult");
                    regA[name] = wrapNotEraFilter(postCalcutate(logic_overrides[regName][name], "adult", regName), "child");
                } else {
                    regC[name] = wrapNotEraFilter(postCalcutate(locations.get(node), "child", regName), "adult");
                    regA[name] = wrapNotEraFilter(postCalcutate(locations.get(node), "adult", regName), "child");
                }
            }
            for (let node of data.events) {
                let name = translateEventName(node);
                if (logic_overrides[regName] != null && logic_overrides[regName][name] != null) {
                    regC[name] = wrapNotEraFilter(postCalcutate(logic_overrides[regName][name], "child", regName), "adult");
                    regA[name] = wrapNotEraFilter(postCalcutate(logic_overrides[regName][name], "adult", regName), "child");
                } else {
                    regC[name] = wrapNotEraFilter(postCalcutate(events.get(node), "child", regName), "adult");
                    regA[name] = wrapNotEraFilter(postCalcutate(events.get(node), "adult", regName), "child");
                }
            }
            res.edges[`${regName}[child]`] = regC;
            res.edges[`${regName}[adult]`] = regA;
        }
        // mixins
        for (var [key, value] of mixins) {
            res.logic[`${key}[child]`] = postCalcutate(value, "child");
            res.logic[`${key}[adult]`] = postCalcutate(value, "adult");
        }
        // functions
        for (var [key, value] of functions) {
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
        // END overrides
        // BEGIN Gateways
        res.edges["region.bottom_of_the_well_gateway[child]"] = {
            "region.kakariko_village[child]": {
                "type": "true"
            },
            "region.bottom_of_the_well[child]": {
                "type": "true"
            },
            "region.bottom_of_the_well_mq[child]": {
                "type": "true"
            }
        };
        res.edges["region.bottom_of_the_well_gateway[adult]"] = {
            "region.kakariko_village[adult]": {
                "type": "true"
            },
            "region.bottom_of_the_well[adult]": {
                "type": "true"
            },
            "region.bottom_of_the_well_mq[adult]": {
                "type": "true"
            }
        };
        res.edges["region.deku_tree_gateway[child]"] = {
            "region.kf_outside_deku_tree[child]": {
                "type": "true"
            },
            "region.deku_tree_lobby[child]": {
                "type": "true"
            },
            "region.deku_tree_lobby_mq[child]": {
                "type": "true"
            }
        };
        res.edges["region.deku_tree_gateway[adult]"] = {
            "region.kf_outside_deku_tree[adult]": {
                "type": "true"
            },
            "region.deku_tree_lobby[adult]": {
                "type": "true"
            },
            "region.deku_tree_lobby_mq[adult]": {
                "type": "true"
            }
        };
        res.edges["region.dodongos_cavern_gateway[child]"] = {
            "region.dodongos_cavern_entryway[child]": {
                "type": "true"
            },
            "region.dodongos_cavern_beginning[child]": {
                "type": "true"
            },
            "region.dodongos_cavern_beginning_mq[child]": {
                "type": "true"
            }
        };
        res.edges["region.dodongos_cavern_gateway[adult]"] = {
            "region.dodongos_cavern_entryway[adult]": {
                "type": "true"
            },
            "region.dodongos_cavern_beginning[adult]": {
                "type": "true"
            },
            "region.dodongos_cavern_beginning_mq[adult]": {
                "type": "true"
            }
        };
        res.edges["region.fire_temple_gateway[child]"] = {
            "region.fire_temple_entrance[child]": {
                "type": "true"
            },
            "region.fire_temple_lower[child]": {
                "type": "true"
            },
            "region.fire_temple_lower_mq[child]": {
                "type": "true"
            }
        };
        res.edges["region.fire_temple_gateway[adult]"] = {
            "region.fire_temple_entrance[adult]": {
                "type": "true"
            },
            "region.fire_temple_lower[adult]": {
                "type": "true"
            },
            "region.fire_temple_lower_mq[adult]": {
                "type": "true"
            }
        };
        res.edges["region.forest_temple_gateway[child]"] = {
            "region.sacred_forest_meadow[child]": {
                "type": "true"
            },
            "region.forest_temple_lobby[child]": {
                "type": "true"
            },
            "region.forest_temple_lobby_mq[child]": {
                "type": "true"
            }
        };
        res.edges["region.forest_temple_gateway[adult]"] = {
            "region.sacred_forest_meadow[adult]": {
                "type": "true"
            },
            "region.forest_temple_lobby[adult]": {
                "type": "true"
            },
            "region.forest_temple_lobby_mq[adult]": {
                "type": "true"
            }
        };
        res.edges["region.ganons_castle_gateway[child]"] = {
            "region.ganons_castle_grounds[child]": {
                "type": "true"
            },
            "region.ganons_castle_lobby[child]": {
                "type": "true"
            },
            "region.ganons_castle_lobby_mq[child]": {
                "type": "true"
            }
        };
        res.edges["region.ganons_castle_gateway[adult]"] = {
            "region.ganons_castle_grounds[adult]": {
                "type": "true"
            },
            "region.ganons_castle_lobby[adult]": {
                "type": "true"
            },
            "region.ganons_castle_lobby_mq[adult]": {
                "type": "true"
            }
        };
        res.edges["region.gerudo_training_grounds_gateway[child]"] = {
            "region.gerudo_fortress[child]": {
                "type": "true"
            },
            "region.gerudo_training_grounds_lobby[child]": {
                "type": "true"
            },
            "region.gerudo_training_grounds_lobby_mq[child]": {
                "type": "true"
            }
        };
        res.edges["region.gerudo_training_grounds_gateway[adult]"] = {
            "region.gerudo_fortress[adult]": {
                "type": "true"
            },
            "region.gerudo_training_grounds_lobby[adult]": {
                "type": "true"
            },
            "region.gerudo_training_grounds_lobby_mq[adult]": {
                "type": "true"
            }
        };
        res.edges["region.ice_cavern_gateway[child]"] = {
            "region.zoras_fountain[child]": {
                "type": "true"
            },
            "region.ice_cavern_beginning[child]": {
                "type": "true"
            },
            "region.ice_cavern_beginning_mq[child]": {
                "type": "true"
            }
        };
        res.edges["region.ice_cavern_gateway[adult]"] = {
            "region.zoras_fountain[adult]": {
                "type": "true"
            },
            "region.ice_cavern_beginning[adult]": {
                "type": "true"
            },
            "region.ice_cavern_beginning_mq[adult]": {
                "type": "true"
            }
        };
        res.edges["region.jabu_jabus_belly_gateway[child]"] = {
            "region.zoras_fountain[child]": {
                "type": "true"
            },
            "region.jabu_jabus_belly_beginning[child]": {
                "type": "true"
            },
            "region.jabu_jabus_belly_beginning_mq[child]": {
                "type": "true"
            }
        };
        res.edges["region.jabu_jabus_belly_gateway[adult]"] = {
            "region.zoras_fountain[adult]": {
                "type": "true"
            },
            "region.jabu_jabus_belly_beginning[adult]": {
                "type": "true"
            },
            "region.jabu_jabus_belly_beginning_mq[adult]": {
                "type": "true"
            }
        };
        res.edges["region.shadow_temple_gateway[child]"] = {
            "region.graveyard_warp_pad_region[child]": {
                "type": "true"
            },
            "region.shadow_temple_entryway[child]": {
                "type": "true"
            },
            "region.shadow_temple_entryway_mq[child]": {
                "type": "true"
            }
        };
        res.edges["region.shadow_temple_gateway[adult]"] = {
            "region.graveyard_warp_pad_region[adult]": {
                "type": "true"
            },
            "region.shadow_temple_entryway[adult]": {
                "type": "true"
            },
            "region.shadow_temple_entryway_mq[adult]": {
                "type": "true"
            }
        };
        res.edges["region.spirit_temple_gateway[child]"] = {
            "region.desert_colossus[child]": {
                "type": "true"
            },
            "region.spirit_temple_lobby[child]": {
                "type": "true"
            },
            "region.spirit_temple_lobby_mq[child]": {
                "type": "true"
            }
        };
        res.edges["region.spirit_temple_gateway[adult]"] = {
            "region.desert_colossus[adult]": {
                "type": "true"
            },
            "region.spirit_temple_lobby[adult]": {
                "type": "true"
            },
            "region.spirit_temple_lobby_mq[adult]": {
                "type": "true"
            }
        };
        res.edges["region.water_temple_gateway[child]"] = {
            "region.lake_hylia[child]": {
                "type": "true"
            },
            "region.water_temple_lobby[child]": {
                "type": "true"
            },
            "region.water_temple_lobby_mq[child]": {
                "type": "true"
            }
        };
        res.edges["region.water_temple_gateway[adult]"] = {
            "region.lake_hylia[adult]": {
                "type": "true"
            },
            "region.water_temple_lobby[adult]": {
                "type": "true"
            },
            "region.water_temple_lobby_mq[adult]": {
                "type": "true"
            }
        };
        // END Gateways
        
        console.log("");
        console.log("-------------------------------------------");
        console.log("states not converted");
        console.log("");
        console.log(JSON.stringify(unstate, null, 4));

        return res;
    }

}

function postCalcutate(input, age = "", region = "")  {
    let els = [];
	//console.log(input);
    switch(input.type) {
        case "mixin":
            if (age != "") {
                return {
                    type: "mixin",
                    el: `${input.el}[${age}]`
                };
            }
            return input;
        case "value":
            if (input.el.indexOf(".") >= 0) {
                if (input.el.startsWith("mixin.") || input.el.startsWith("function.") && age != "") {
                    return {
                        type: "mixin",
                        el: `${input.el}[${age}]`
                    };
                }
                /*if (input.el.startsWith("event.") || input.el.startsWith("logic.location.")) {
                    return {
                        type: "at",
                        node: input.el,
                        el: {
                            type: "true"
                        }
                    };
                }*/
                return input;
            }
            let res = Translation.getValueName(input.el);
            if (res != null) {
                return postCalcutate(res, age, region);
            }
            let mixname = translateMixinName(input.el);
            if (mixins.has(mixname)) {
                if (age != "") {
                    return {
                        type: "mixin",
                        el: `${mixname}[${age}]`
                    };
                }
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
            if (input.el == "age" && age != "") {
                if (input.value == age) {
                    return {
                        type: "true"
                    };
                } else {
                    return {
                        type: "false"
                    };
                }
            }
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
            if (age != "") {
                return {
                    type: "mixin",
                    el: `${fnName}[${age}]`
                };
            }
            return {
                type: "mixin",
                el: fnName
            };
        case "at":
            return {
                type: "or",
                el: [
                    {
                        type: "at",
                        node: `${translateRegionName(input.node)}[child]`,
                        el: postCalcutate(input.el, "child", region)
                    },
                    {
                        type: "at",
                        node: `${translateRegionName(input.node)}[adult]`,
                        el: postCalcutate(input.el, "adult", region)
                    }
                ]
            };
            return ;
        case "here":
            return {
                type: "or",
                el: [
                    {
                        type: "at",
                        node: `${translateRegionName(region)}[child]`,
                        el: postCalcutate(input.el, "child", region)
                    },
                    {
                        type: "at",
                        node: `${translateRegionName(region)}[adult]`,
                        el: postCalcutate(input.el, "adult", region)
                    }
                ]
            };
        case "and":
        case "nand":
        case "or":
        case "nor":
        case "xor":
        case "xnor":
            for (let el of input.el) {
                els.push(postCalcutate(el, age, region));
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
                        el: postCalcutate(input.el, age, region),
                        value: input.value.replace(/^'|'$/g, "")
                    };
                }
                return {
                    type: input.type,
                    el: postCalcutate(input.el, age, region),
                    value: buffer
                };
        case "not":
            return {
                type: "not",
                el: postCalcutate(input.el, age, region)
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