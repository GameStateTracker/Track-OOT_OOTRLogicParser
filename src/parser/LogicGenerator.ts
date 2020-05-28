
import Translation from "../utils/Translation";

declare global {
    type JSONLogic = {
        type: string,
        el?: string | JSONLogic | JSONLogic[],
        value?: string | number,
        category?: string
    };
    type JSONFunction = {
        params: string[],
        logic: JSONLogic
    };
    type JSONLogicMap = { [index: string]: JSONLogic };
    type JSONLogicNodes = { [index: string]: JSONLogicMap };
    type JSONLogicRegion = {
        locations: JSONLogicNodes,
        exits: JSONLogicNodes,
    };
    type JSONLogicContainer = { [index: string]: JSONLogicRegion };
    type JSONLogicStructure = {
        [index: string]: {
            locations: string[],
            exits: string[],
        }
    };
    type JSONLogicResult = {
        edges: JSONLogicNodes,
        mixins: JSONLogicMap
    };
}

export default abstract class LogicGenerator {

    private static mixin: Map<string, JSONLogic> = new Map();
    private static functions: Map<string, JSONFunction> = new Map();
    private static exits: Map<string, JSONLogic> = new Map();
    private static locations: Map<string, JSONLogic> = new Map();
    private static structure: JSONLogicStructure = {};

    public static addMixin(key: string, value: JSONLogic) {
        LogicGenerator.mixin.set(key, value);
    }

    public static addFunction(key: string, value: JSONFunction) {
        LogicGenerator.functions.set(key, value);
    }

    public static addExit(region: string, key: string, value: JSONLogic) {
        if (LogicGenerator.structure[region] == null) {
            LogicGenerator.structure[region] = {
                locations: [],
                exits: []
            };
        }
        LogicGenerator.structure[region].exits.push(key);
        LogicGenerator.exits.set(key, value);
    }

    public static addLocation(region: string, key: string, value: JSONLogic) {
        if (LogicGenerator.structure[region] == null) {
            LogicGenerator.structure[region] = {
                locations: [],
                exits: []
            };
        }
        LogicGenerator.structure[region].locations.push(key);
        LogicGenerator.locations.set(key, value);
    }

    public static generate(): JSONLogicResult  {
        let res: JSONLogicResult = {
            edges: {},
            mixins: {}
        };
        for (let region in LogicGenerator.structure) {
            let data = LogicGenerator.structure[region];
            let reg: JSONLogicMap = {};
            for (let node of data.exits) {
                reg[LogicGenerator.translateRegionName(node)] = LogicGenerator.postCalcutate(<JSONLogic> LogicGenerator.exits.get(node));
            }
            for (let node of data.locations) {
                reg[Translation.translateName(node)] = LogicGenerator.postCalcutate(<JSONLogic> LogicGenerator.locations.get(node));
            }
            res.edges[LogicGenerator.translateRegionName(region)] = reg;
        }
        LogicGenerator.mixin.forEach((value, key) => {
            res.mixins[LogicGenerator.translateMixinName(key)] = LogicGenerator.postCalcutate(value);
        });
        LogicGenerator.functions.forEach((value, key) => {
            //res.mixins[LogicGenerator.translateFunctionName(key)] = LogicGenerator.postCalcutate(value.logic);
            res.mixins[LogicGenerator.translateFunctionName(key)] = value.logic;
        });
        return res;
    }

    private static postCalcutate(input: JSONLogic): JSONLogic  {
        switch(input.type) {
            case "value":
                let res = <JSONLogic> Translation.getOverride(<string> input.el);
                if (res != null) {
                    return res;
                }
                if (LogicGenerator.mixin.has(<string> input.el)) {
                    return {
                        type: "value",
                        el: <string> LogicGenerator.translateMixinName(<string> input.el)
                    };
                }
                return input;
            case "state":
                return {
                    type: "state",
                    el: Translation.translateName(<string> input.el, /^(option\.|skip\.)/),
                    value: (<string> input.value).replace(/^'|'$/g, "")
                };
            case "function":
                if (input.value == "at" || input.value == "here") {
                    return input;
                }
                return {
                    type: "value",
                    el: <string> LogicGenerator.translateFunctionName(<string> input.value)
                };
            case "and":
            case "nand":
            case "or":
            case "nor":
            case "xor":
            case "xnor":
                let els: JSONLogic[] = [];
                for (let el of <JSONLogic[]> input.el) {
                    els.push(LogicGenerator.postCalcutate(el));
                }
                return {
                    type: input.type,
                    el: els
                };
            case "min":
            case "max":
                    let buffer = parseInt(<string> input.value);
                    if (isNaN(buffer)) {
                        return {
                            type: input.type == "min" ? "lte" : "gte",
                            el: LogicGenerator.postCalcutate(<JSONLogic> input.el),
                            value: (<string> input.value).replace(/^'|'$/g, "")
                        };
                    }
                    return {
                        type: input.type,
                        el: LogicGenerator.postCalcutate(<JSONLogic> input.el),
                        value: buffer
                    };
            case "not":
                return {
                    type: "state",
                    el: LogicGenerator.postCalcutate(<JSONLogic> input.el)
                };
            default:
                return input;
        }
    }

    private static translateRegionName(input: string): string {
        return `region.${input.toLowerCase().replace(/ /g, "_")}`;
    }

    private static translateMixinName(input: string): string {
        return `mixin.${input.toLowerCase().replace(/ /g, "_")}`;
    }

    private static translateFunctionName(input: string): string {
        return `function.${input.toLowerCase().replace(/ /g, "_")}`;
    }

}