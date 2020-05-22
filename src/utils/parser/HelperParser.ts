import RandONC from "../RandONC";
import RandTokenizer from "../RandTokenizer";
import LogicBuilder from "../LogicBuilder";
import Translation from "../Translation";

export default abstract class HelperParser {

    private static rules: JSONLogicMap = {};

    public static parse(input: string): void {
        let helpers = <JSONMap> RandONC.parse(input);
        for (let i in helpers) {
            if (i.indexOf("(") > 0) {
                // TODO generate function helpers
                HelperParser.rules[i] = HelperParser.transpile(<string> helpers[i]);
            } else {
                HelperParser.rules[i] = HelperParser.transpile(<string> helpers[i]);
            }
        }
    }

    public static get(): JSONLogicMap {
        let rules = HelperParser.rules;
        HelperParser.rules = {};
        return rules;
    }

    private static transpile(input: string): JSONLogic {
        let token = RandTokenizer.tokenize(input);
        return LogicBuilder.build(token);
    }

}