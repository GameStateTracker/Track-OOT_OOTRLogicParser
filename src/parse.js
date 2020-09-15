import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import JSONFile from "./utils/JSONFile.js";
import Translation from "./utils/Translation.js";
import HelperParser from "./parser/HelperParser.js";
import LogicParser from "./parser/LogicParser.js";
import LogicGenerator from "./parser/LogicGenerator.js";

const __dirname = path.resolve();

const inHelperFile  = path.join(__dirname, "/input/data/LogicHelpers.json");
const inLogicDir  = path.join(__dirname, "/input/data/World");
const inGlitchedDir  = path.join(__dirname, "/input/data/Glitched World");
const outputDir = path.join(__dirname, "/output/");

const transRulesFile = path.join(__dirname, "/translation/predict_rules.json");

if (!fs.existsSync(inLogicDir)) {
    execSync('git clone "https://github.com/TestRunnerSRL/OoT-Randomizer.git" "input"');
} else {
    execSync('cd input && git pull --rebase');
}
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, {
        recursive: true
    });
}

// set translation rules
const rules = new Map(Object.entries(JSONFile.read(transRulesFile, {})));
rules.forEach((v, k) => {
    Translation.addRule(new RegExp(k, "i"), new RegExp(v, "i"));
});

// parse helpers
HelperParser.parse(fs.readFileSync(inHelperFile).toString());

// parse logic
fs.readdirSync(inLogicDir).forEach(function(file) {
    let iname = path.join(inLogicDir, file);
    let mq = 0;
    let dungeon = 1;
    if(iname.endsWith("MQ.json")) mq = 1;
    if(iname.endsWith("Overworld.json")) dungeon = 0;
    LogicParser.parse(fs.readFileSync(iname).toString(), mq, dungeon);
});
let logic = JSON.stringify(LogicGenerator.generate(), null, 4);
fs.writeFileSync(`${outputDir}/logic.json`, logic);

// rreset generator
LogicGenerator.reset();

// parse glitched logic
fs.readdirSync(inGlitchedDir).forEach(function(file) {
    let iname = path.join(inGlitchedDir, file);
    let mq = 0;
    let dungeon = 1;
    if(iname.endsWith("MQ.json")) mq = 1;
    if(iname.endsWith("Overworld.json")) dungeon = 0;
    LogicParser.parse(fs.readFileSync(iname).toString(), mq, dungeon);
});
let glitched = JSON.stringify(LogicGenerator.generate(), null, 4);
fs.writeFileSync(`${outputDir}/logic_glitched.json`, glitched);