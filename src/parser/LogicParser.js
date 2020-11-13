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
let success = {};
const exits = ["Kakariko Village", "KF Outside Deku Tree", "Death Mountain", "Zoras Fountain", "ZF Ice Ledge", "Gerudo Fortress", "SFM Forest Temple Entrance Ledge", "DMC Fire Temple Entrance", "Lake Hylia", "Graveyard Warp Pad Region", "Desert Colossus", "Castle Grounds"]

class LogicParser {

    parse(input, mq, write) {
        let output = RandONC.parse(input);
        output.forEach((value) => {
            if(mq === 1) value.region_name = value.region_name + " MQ"
            for (let i in value.locations) {
                let rule = value.locations[i];
                LogicGenerator.addLocation(value.region_name, i, transpile(rule));
            }
            for (let i in value.exits) {
                const exit = i;
                let rule = value.exits[i];
                if(mq === 1) {
                    if(!exits.includes(i)) i = i + " MQ"
                }
                let regionName = value.region_name
                if(regionName.endsWith(" MQ")) regionName = regionName.replace(" MQ", "");
                if(write === 1) {
                    if (!success.hasOwnProperty(regionName)) success[regionName] = {};
                    success[regionName][exit] = false;
                }
                if(renameData.hasOwnProperty(regionName)) {
                    //console.log(regionName + ": " + i + "::: is no longer a valid region exit")
                    if(write === 1) {
                        if (!success.hasOwnProperty(regionName)) success[regionName] = {};
                        success[regionName][exit] = false;
                    }
                    if(renameData[regionName][i] !== undefined) {
                        i = renameData[regionName][i];
                        if(write === 1) {
                            if (!success.hasOwnProperty(regionName)) success[regionName] = {};
                            success[regionName][exit] = true;
                        }
                    } /*else if(rename_success[regionName][i] === undefined && !i.endsWith("MQ") && write === 0) {
                        console.log(regionName + ": " + i + "::: valid region exit has changed")
                    }*/
                }
                LogicGenerator.addExit(value.region_name, i, transpile(rule));
            }
            for (let i in value.events) {
                let rule = value.events[i];
                LogicGenerator.addEvent(value.region_name, i, transpile(rule));
            }
        })
    }
    write(write){
        if(write === 1) {
            let data = JSON.stringify(success, null, 4);
            let dataP = JSON.parse(data)
            for(const run in dataP) {
                if(!rename_success.hasOwnProperty(run)) {
                    console.log(run + "::: is a new region")
                    for(const through in dataP[run]) {
                        console.log(through + "::: is a new exit")
                    }
                } else {
                    for(const through in dataP[run]) {
                        if(!rename_success[run].hasOwnProperty(through)) {
                            console.log(run + ": " + through + "::: is a new exit")
                        }
                    }
                }
            }
            for(const run in rename_success) {
                if(!dataP.hasOwnProperty(run)) {
                    console.log(run + "::: is a removed region")
                    for(const through in dataP[run]) {
                        console.log(through + "::: is a removed exit")
                    }
                } else {
                    for(const through in dataP[run]) {
                        if(!dataP[run].hasOwnProperty(through)) {
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