import fs from "fs";
import path from "path";
import JSONFile from "./utils/JSONFile.js";
import Translation from "./utils/Translation.js";
import HelperParser from "./parser/HelperParser.js";
import LogicParser from "./parser/LogicParser.js";
import LogicGenerator from "./parser/LogicGenerator.js";
import {reduceLogic} from "./utils/LogicReducer.js";
import {gatewayData} from "./utils/overrides/GatewayLoader.js";

const __dirname = path.resolve();

/* -------- */

const inHelperFile  = path.join(__dirname, "/input_ap/data/LogicHelpers.json");
const inLogicDir  = path.join(__dirname, "/input_ap/data/World");
const inGlitchedDir  = path.join(__dirname, "/input_ap/data/Glitched World");
const outputDir = path.join(__dirname, "/output/");

const transRulesFile = path.join(__dirname, "/translation/predict_rules.json");

if (!fs.existsSync("./input/data/World")) {
    throw new Error("randomizer logic was not found");
}

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, {recursive: true});
}

// set translation rules
const rules = new Map(Object.entries(JSONFile.read(transRulesFile, {})));
rules.forEach((v, k) => {
    Translation.addRule(new RegExp(k, "i"), new RegExp(v, "i"));
});

const RENAME_BLACKLIST = [
    / Boss Room$/,
    / Boss Gateway$/,
    / Blue Warp Gateway$/,
    "KF Outside Deku Tree",
    "Death Mountain",
    "Zoras Fountain",
    "Kakariko Village",
    "SFM Forest Temple Entrance Ledge",
    "DMC Fire Temple Entrance",
    "Lake Hylia",
    "Graveyard Warp Pad Region",
    "Desert Colossus From Spirit Lobby",
    "ZF Ice Ledge",
    "Gerudo Fortress",
    "Castle Grounds From Ganons Castle",
    "Farores Wind Warp"
];

// parser for normal logic
function parseLogic() {
    console.log("");
    console.log("===========================================");
    console.log("PARSE LOGIC");
    console.log("");
    LogicGenerator.reset();
    LogicParser.parse(gatewayData);

    const files = fs.readdirSync(inLogicDir);
    for (const file of files) {
        const iname = path.join(inLogicDir, file);
        let mq = false;
        if (iname.endsWith("MQ.json")) {
            mq = true;
        }
        LogicParser.parseFile(iname, mq, RENAME_BLACKLIST);
    }

    LogicParser.addCustomLogic();
    LogicParser.regionCheckCall();
    const logic = LogicGenerator.generate();
    const logicData = JSON.stringify(logic, null, 4);
    fs.writeFileSync(`${outputDir}/ap_vanilla.full.json`, logicData);

    /* reduce */
    const reducedLogic = reduceLogic(logic);
    const reducedLogicData = JSON.stringify(reducedLogic, null, 4);
    fs.writeFileSync(`${outputDir}/ap_vanilla.readable.json`, reducedLogicData);

    /* minify */
    const minifiedLogicData = JSON.stringify(reducedLogic);
    fs.writeFileSync(`${outputDir}/ap_vanilla.min.json`, minifiedLogicData);
}

// parser for glitched logic
function parseGlitchedLogic() {
    console.log("");
    console.log("===========================================");
    console.log("PARSE GLITCHED LOGIC");
    console.log("");
    LogicGenerator.reset();
    LogicParser.parse(gatewayData);

    const files = fs.readdirSync(inGlitchedDir);
    for (const file of files) {
        const iname = path.join(inGlitchedDir, file);
        let mq = false;
        if (iname.endsWith("MQ.json")) {
            mq = true;
        }
        LogicParser.parseFile(iname, mq, RENAME_BLACKLIST);
    }

    LogicParser.addCustomLogic();
    // LogicParser.regionCheckCall();
    const logic = LogicGenerator.generate(true);
    const logicData = JSON.stringify(logic, null, 4);
    fs.writeFileSync(`${outputDir}/ap_glitched.full.json`, logicData);

    /* reduce */
    const reducedLogic = reduceLogic(logic);
    const reducedLogicData = JSON.stringify(reducedLogic, null, 4);
    fs.writeFileSync(`${outputDir}/ap_glitched.readable.json`, reducedLogicData);

    /* minify */
    const minifiedLogicData = JSON.stringify(reducedLogic);
    fs.writeFileSync(`${outputDir}/ap_glitched.min.json`, minifiedLogicData);
}

// --------------------------

// parse helpers
console.log("");
console.log("===========================================");
console.log("PARSE HELPERS");
console.log("");
HelperParser.parse(fs.readFileSync(inHelperFile).toString());
// parse logic
parseLogic();
// parse glitched logic
parseGlitchedLogic();
