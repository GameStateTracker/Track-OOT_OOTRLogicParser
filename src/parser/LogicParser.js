import fs from "fs";
import path from "path";
import RandONC from "../utils/RandONCFile.js";
import RandTokenizer from "../utils/RandTokenizer.js";
import LogicBuilder from "../utils/LogicBuilder.js";
import LogicGenerator from "./LogicGenerator.js";
const __dirname = path.resolve();
const inExitRenameFile  = path.join(__dirname, "/gateways/exitRename.json");
const renameData = JSON.parse(fs.readFileSync(inExitRenameFile, 'utf8'));
const exits = ["Kakariko Village", "KF Outside Deku Tree", "Dodongos Cavern Entryway", "Zoras Fountain", "Gerudo Fortress", "Sacred Forest Meadow", "Fire Temple Entrance", "Lake Hylia", "Graveyard Warp Pad Region", "Desert Colossus", "Ganons Castle Grounds"]

class LogicParser {

    parse(input, mq) {
        let output = RandONC.parse(input);
        output.forEach((value) => {
            if(mq === 1) value.region_name = value.region_name + " MQ"
            for (let i in value.locations) {
                let rule = value.locations[i];
                LogicGenerator.addLocation(value.region_name, i, transpile(rule));
            }
            for (let i in value.exits) {
                let rule = value.exits[i];
                if(mq === 1) {
                    if(!exits.includes(i)) i = i + " MQ"
                }
                let regionName = value.region_name
                if(regionName.endsWith(" MQ")) regionName = regionName.replace(" MQ", "");
                if(renameData.hasOwnProperty(regionName)) {
                    if(renameData[regionName][i] !== undefined) {
                        i = renameData[regionName][i];
                    }
                }
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
    const token = RandTokenizer.tokenize(input);
    return LogicBuilder.build(token);
}

export default new LogicParser();