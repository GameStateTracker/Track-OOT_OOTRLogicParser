import RandONC from "../utils/RandONCFile.js";
import RandTokenizer from "../utils/RandTokenizer.js";
import LogicBuilder from "../utils/LogicBuilder.js";
import LogicGenerator from "./LogicGenerator.js";

class LogicParser {

    parse(input) {
        let output = RandONC.parse(input);
        output.forEach((value) => {
            for (let i in value.locations) {
                let rule = value.locations[i];
                LogicGenerator.addLocation(value.region_name, i, transpile(rule));
            }
            for (let i in value.exits) {
                let rule = value.exits[i];
                LogicGenerator.addExit(value.region_name, i, transpile(rule));
            }
            for (let i in value.events) {
                let rule = value.events[i];
                LogicGenerator.addEvent(value.region_name, i, transpile(rule));
            }
        })
    }

	parseGlitched(input) {
        let output = RandONC.parse(input);
        output.forEach((value) => {
            for (let i in value.locations) {
                let rule = value.locations[i];
                LogicGenerator.addLocationGlitched(value.region_name, i, transpile(rule));
            }
            for (let i in value.exits) {
                let rule = value.exits[i];
                LogicGenerator.addExitGlitched(value.region_name, i, transpile(rule));
            }
            for (let i in value.events) {
                let rule = value.events[i];
                LogicGenerator.addEventGlitched(value.region_name, i, transpile(rule));
            }
        })
    }
	
}

function transpile(input) {
    let token = RandTokenizer.tokenize(input);
    return LogicBuilder.build(token);
}

export default new LogicParser();