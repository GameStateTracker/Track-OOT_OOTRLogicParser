import RandONC from "../RandONC";
import RandTokenizer from "../RandTokenizer";
import LogicBuilder from "../LogicBuilder";
import LogicGenerator from "./LogicGenerator";

export default abstract class LogicParser {

    public static parse(input: string): void {
        let output = <JSONArray> RandONC.parse(input);
        output.forEach((value: any) => {
            for (let i in value.locations) {
                let rule = value.locations[i];
                LogicGenerator.addLocation(value.region_name, i, LogicParser.transpile(rule));
            }
            for (let i in value.exits) {
                let rule = value.exits[i];
                LogicGenerator.addExit(value.region_name, i, LogicParser.transpile(rule));
            }
        })
    }

    private static transpile(input: string): JSONLogic {
        let token = RandTokenizer.tokenize(input);
        return LogicBuilder.build(token);
    }

}