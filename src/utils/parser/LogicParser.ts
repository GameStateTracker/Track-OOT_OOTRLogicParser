import RandONC from "../RandONC";
import RandTokenizer from "../RandTokenizer";
import LogicBuilder from "../LogicBuilder";
import Translation from "../Translation";

export default abstract class LogicParser {

    private static nodes: JSONLogicNodes = {};

    public static parse(input: string): void {
        let output = <JSONArray> RandONC.parse(input);
        output.forEach((value: any) => {
            let rules: JSONLogicMap = {};
            for (let i in value.locations) {
                let rule = value.locations[i];
                rule = LogicParser.transpile(rule);
                rules[Translation.translate(i)] = rule;
            }
            for (let i in value.exits) {
                let rule = value.exits[i];
                rule = LogicParser.transpile(rule);
                rules[Translation.translate(i)] = rule;
            }
            LogicParser.nodes[Translation.translate(value.region_name)] = rules;
        })
    }

    public static get(): JSONLogicNodes {
        let nodes = LogicParser.nodes;
        LogicParser.nodes = {};
        return nodes;
    }

    private static transpile(input: string): JSONLogic {
        let token = RandTokenizer.tokenize(input);
        return LogicBuilder.build(token);
    }

}