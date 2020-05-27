import RandONC from "../RandONC";
import RandTokenizer from "../RandTokenizer";
import LogicBuilder from "../LogicBuilder";
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
                let fname = i.slice(0, pos - 1);
                let params = i.slice(pos + 1, -1).split(", ");
                LogicGenerator.addFunction(i.slice(pos + 1, -1), HelperParser.transpileFunction(<string> helpers[i], params));
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
        let token = RandTokenizer.tokenize(input);
        return {
            params: params,
            logic: LogicBuilder.build(token)
        };
    }

    private static transpile(input: string): JSONLogic {
        let token = RandTokenizer.tokenize(input);
        return LogicBuilder.build(token);
    }

}