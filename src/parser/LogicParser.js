import fs from "fs";
import path from "path";
import RandONC from "../utils/RandONCFile.js";
import RandTokenizer from "../utils/RandTokenizer.js";
import LogicBuilder from "../utils/LogicBuilder.js";
import LogicGenerator from "./LogicGenerator.js";
import RegionCheck from "../utils/RegionCheck.js";
const __dirname = path.resolve();
const inExitRenameFile  = path.join(__dirname, "/gateways/exitRename.json");
const renameData = JSON.parse(fs.readFileSync(inExitRenameFile, "utf8"));
const success = {
    mainRegions: {},
    subRegions: {}
};
const exits = ["Kakariko Village", "KF Outside Deku Tree", "Death Mountain", "Zoras Fountain", "ZF Ice Ledge", "Gerudo Fortress", "SFM Forest Temple Entrance Ledge", "DMC Fire Temple Entrance", "Lake Hylia", "Graveyard Warp Pad Region", "Desert Colossus", "Castle Grounds", "Ganons Castle Grounds", "Ganons Castle Tower"]

class LogicParser {

    parse(input, mq = false) {
        const output = RandONC.parse(input);
        output.forEach((value) => {
            if (mq) value.region_name = value.region_name + " MQ"
            for (const i in value.locations) {
                let rule = value.locations[i];
                if (rule.includes("at")) {
                    let split = rule.split("at('")
                    if (split[1] != undefined) {
                        let split2 = split[1].split("'");
                        if (mq) {
                            split2[0] = split2[0] + " MQ";
                            split2 = split2.join("'");
                            split[1] = split2;
                            split = split.join("at('");
                            rule = split;
                        }
                    }
                }
                if (i.includes(" GS ") || i.endsWith(" GS")) {
                    if (rule.includes("at_night")) {
                        const split = rule.split("at_night");
                        rule = split.join("at_night_gs");
                    }
                }
                LogicGenerator.addLocation(value.region_name, i, transpile(rule));
            }
            for (let i in value.exits) {
                const rule = value.exits[i];
                if (mq) {
                    if (!exits.includes(i)) i = i + " MQ"
                }
                let regionName = value.region_name
                if (regionName.endsWith(" MQ")) regionName = regionName.replace(" MQ", "");
                if (renameData[regionName] != null) {
                    if (renameData[regionName][i] !== undefined) i = renameData[regionName][i];
                }
                if (success.subRegions[value.region_name] == null) success.subRegions[value.region_name] = {};
                success.mainRegions[value.region_name] = false;
                success.subRegions[value.region_name][i] = false;
                LogicGenerator.addExit(value.region_name, i, transpile(rule));
            }
            for (const i in value.events) {
                const rule = value.events[i];
                LogicGenerator.addEvent(value.region_name, i, transpile(rule));
            }
        })
    }

    regionCheckCall() {
        RegionCheck.checkRegions(success);
    }

}

function transpile(input) {
    const token = RandTokenizer.tokenize(input);
    return LogicBuilder.build(token);
}

export default new LogicParser();
