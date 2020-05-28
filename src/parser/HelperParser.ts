import RandONC from "../utils/RandONC";
import RandTokenizer from "../utils/RandTokenizer";
import LogicBuilder from "../utils/LogicBuilder";
import LogicGenerator from "./LogicGenerator";

export default abstract class HelperParser {

    private static rules: JSONLogicMap = {};

    public static parse(input: string): void {
        let helpers = <JSONMap> RandONC.parse(input);
        for (let i in helpers) {
            let pos = i.indexOf("(");
            if (pos > 0) {
                // TODO generate function helpers
                // functions need to geenerate a "mixin" for each different parameters they are called with
                let fname = i.slice(0, pos);
                let params = i.slice(pos + 1, -1).split(", ");
                LogicGenerator.addFunction(fname, HelperParser.transpileFunction(<string> helpers[i], params));
            } else {
                LogicGenerator.addMixin(i, HelperParser.transpile(<string> helpers[i]));
            }
        }
    }

    public static get(): JSONLogicMap {
        let rules = HelperParser.rules;
        HelperParser.rules = {};
        return rules;
    }

    private static transpileFunction(input: string, params: string[]): JSONFunction {
        //console.log(input);
        let token = RandTokenizer.tokenize(input);
        //console.log(token);
        let logic = LogicBuilder.build(token);
        //console.log(logic);
        //console.log("----------------------------");
        return {
            params: params,
            logic: logic
        };
    }

    private static transpile(input: string): JSONLogic {
        let token = RandTokenizer.tokenize(input);
        let logic = LogicBuilder.build(token);
        return logic;
    }

}