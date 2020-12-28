import fs from "fs";
import path from "path";
import RandONC from "../utils/RandONCFile.js";
import RandTokenizer from "../utils/RandTokenizer.js";
import LogicBuilder from "../utils/LogicBuilder.js";
import LogicGenerator from "./LogicGenerator.js";
const __dirname = path.resolve();
const inExitRenameFile  = path.join(__dirname, "/gateways/exitRename.json");
const inExitSuccessFile  = path.join(__dirname, "/gateways/rename_success.json");
const renameData = JSON.parse(fs.readFileSync(inExitRenameFile, 'utf8'));
const rename_success = JSON.parse(fs.readFileSync(inExitSuccessFile, 'utf8'));
const success = {};
const exits = ["Kakariko Village", "KF Outside Deku Tree", "Death Mountain", "Zoras Fountain", "ZF Ice Ledge", "Gerudo Fortress", "SFM Forest Temple Entrance Ledge", "DMC Fire Temple Entrance", "Lake Hylia", "Graveyard Warp Pad Region", "Desert Colossus", "Castle Grounds", "Ganons Castle Grounds", 'Ganons Castle Tower']

class LogicParser {

    parse(input, mq = false, write = false) {
        const output = RandONC.parse(input);
        output.forEach((value) => {
            if (mq) value.region_name = value.region_name + " MQ"
            for (const i in value.locations) {
                let rule = value.locations[i];
                if(rule.includes('at')) {
                    let split = rule.split('at(\'')
                    if(split[1] != undefined) {
                        let split2 = split[1].split('\'');
                        if(mq) {
                            split2[0] = split2[0] + " MQ";
                            split2 = split2.join('\'');
                            split[1] = split2;
                            split = split.join('at(\'');
                            rule = split;
                        }
                    }
                }
                LogicGenerator.addLocation(value.region_name, i, transpile(rule));
            }
            for (let i in value.exits) {
                const exit = i;
                const rule = value.exits[i];
                if (mq) {
                    if (!exits.includes(i)) i = i + " MQ"
                }
                let regionName = value.region_name
                if (regionName.endsWith(" MQ")) regionName = regionName.replace(" MQ", "");
                if (write) {
                    if (success[regionName] == null) success[regionName] = {};
                    success[regionName][exit] = false;
                }
                if (renameData[regionName] != null) {
                    //console.log(regionName + ": " + i + "::: is no longer a valid region exit")
                    if (write) {
                        if (success[regionName] == null) success[regionName] = {};
                        success[regionName][exit] = false;
                    }
                    if (renameData[regionName][i] !== undefined) {
                        i = renameData[regionName][i];
                        if (write) {
                            if (success[regionName] == null) success[regionName] = {};
                            success[regionName][exit] = true;
                        }
                    } /*else if(rename_success[regionName][i] === undefined && !i.endsWith("MQ") && write === 0) {
                        console.log(regionName + ": " + i + "::: valid region exit has changed")
                    }*/
                }
                LogicGenerator.addExit(value.region_name, i, transpile(rule));
            }
            for (const i in value.events) {
                const rule = value.events[i];
                LogicGenerator.addEvent(value.region_name, i, transpile(rule));
            }
        })
    }

    write(write = false) {
        if (write) {
            const data = JSON.stringify(success, null, 4);
            const dataP = JSON.parse(data)
            for (const run in dataP) {
                if (rename_success[run] == null) {
                    console.log(run + "::: is a new region")
                    for (const through in dataP[run]) {
                        console.log(through + "::: is a new exit")
                    }
                } else {
                    for (const through in dataP[run]) {
                        if (rename_success[run][through] == null) {
                            console.log(run + ": " + through + "::: is a new exit")
                        }
                    }
                }
            }
            for (const run in rename_success) {
                if (dataP[run] == null) {
                    console.log(run + "::: is a removed region")
                    for (const through in dataP[run]) {
                        console.log(through + "::: is a removed exit")
                    }
                } else {
                    for (const through in dataP[run]) {
                        if (dataP[run][through] == null) {
                            console.log(run + ": " + through + "::: is a removed exit")
                        }
                    }
                }
            }
            fs.writeFileSync(`${__dirname}/gateways/rename_success.json`, data);
        }
    }

}

function transpile(input) {
    const token = RandTokenizer.tokenize(input);
    return LogicBuilder.build(token);
}

export default new LogicParser();
