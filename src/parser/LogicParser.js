import RandONC from "../utils/RandONCFile.js";
import RandTokenizer from "../utils/RandTokenizer.js";
import LogicBuilder from "../utils/LogicBuilder.js";
import LogicGenerator from "./LogicGenerator.js";
const dungeonExits = ["Kakariko Village", "KF Outside Deku Tree", "Dodongos Cavern Entryway", "Fire Temple Entrance", "Sacred Forest Meadow", "Ganons Castle Grounds", "Gerudo Fortress", "Zoras Fountain", "Zoras Fountain", "Graveyard Warp Pad Region", "Desert Colossus", "Lake Hylia"]
const dungeonEntrances = ["Bottom of the Well Gateway", "Deku Tree Gateway", "Dodongos Cavern Gateway", "Fire Temple Gateway", "Forest Temple Gateway", "Ganons Castle Gateway", "Gerudo Training Grounds Gateway", "Ice Cavern Gateway", "Jabu Jabus Belly Gateway", "Shadow Temple Gateway", "Spirit Temple Gateway", "Water Temple Gateway"]
const overworldExits = ["Bottom of the Well", "Deku Tree Lobby", "Dodongos Cavern Beginning", "Fire Temple Lower", "Forest Temple Lobby", "Ganons Castle Lobby", "Gerudo Training Grounds Lobby", "Ice Cavern Beginning", "Jabu Jabus Belly Beginning", "Shadow Temple Entryway", "Spirit Temple Lobby", "Water Temple Lobby"]
let zora = 0;
let zoramq = 0;

class LogicParser {

    parse(input, mq, dungeon) {
        let output = RandONC.parse(input);
        output.forEach((value) => {
            if(mq === 1) value.region_name = value.region_name + " MQ"
            //console.log(value.region_name);
            for (let i in value.locations) {
                let rule = value.locations[i];
                LogicGenerator.addLocation(value.region_name, i, transpile(rule));
            }
            for (let i in value.exits) {
                let rule = value.exits[i];
                if(dungeon === 1)
                {
                    if(mq === 1)
                    {
                        let gateway = 0;
                        for(let k = 0; k < dungeonExits.length; k++) {
                            if(i === dungeonExits[k]) {
                                if(i === dungeonExits[7]) {
                                    if(zoramq === 0) {
                                        i = dungeonEntrances[k]
                                        zoramq = 1;
                                        gateway = 1;
                                    } else {
                                        i = dungeonEntrances[k+1]
                                        zoramq = 0;
                                        gateway = 1;
                                    }
                                } else {
                                    i = dungeonEntrances[k]
                                    gateway = 1;
                                }
                            }
                        }
                        if(gateway === 0) i = i + " MQ";
                    } else {
                        for(let k = 0; k < dungeonExits.length; k++) {
                            if(i === dungeonExits[k]) {
                                if(i === dungeonExits[7]) {
                                    if(zora === 0) {
                                        i = dungeonEntrances[k]
                                        zora = 1;
                                    } else {
                                        i = dungeonEntrances[k+1]
                                        zora = 0;
                                    }
                                } else {
                                    i = dungeonEntrances[k]
                                }
                            }
                        }
                    }
                } else {
                    for(let k = 0; k < overworldExits.length; k++) {
                        if(i === overworldExits[k]) i = dungeonEntrances[k]
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
    let token = RandTokenizer.tokenize(input);
    return LogicBuilder.build(token);
}

export default new LogicParser();