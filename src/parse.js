import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import JSONFile from "./utils/JSONFile.js";
import Translation from "./utils/Translation.js";
import HelperParser from "./parser/HelperParser.js";
import LogicParser from "./parser/LogicParser.js";
import LogicGenerator from "./parser/LogicGenerator.js";
import { filterLogic } from "./_test/LogicTester.js";

const __dirname = path.resolve();

const inGatewayFile  = path.join(__dirname, "/gateways/gateways.json");
const inHelperFile  = path.join(__dirname, "/input/data/LogicHelpers.json");
const inLogicDir  = path.join(__dirname, "/input/data/World");
const inGlitchedDir  = path.join(__dirname, "/input/data/Glitched World");
const outputDir = path.join(__dirname, "/output/");

const transRulesFile = path.join(__dirname, "/translation/predict_rules.json");

let write = 0;
if (process.argv.indexOf('--write') > 0) write = 1;

if (!fs.existsSync(inLogicDir)) {
    execSync('git clone --branch "6.0.1" "https://github.com/TestRunnerSRL/OoT-Randomizer.git" "input"');
} else {
    execSync('cd input && git pull --rebase "https://github.com/TestRunnerSRL/OoT-Randomizer.git" "6.0.1"');
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

// parser for normal logic
function parseLogic() {
    LogicParser.parse(fs.readFileSync(inGatewayFile).toString(), 0, write);
    fs.readdirSync(inLogicDir).forEach(function(file) {
        const iname = path.join(inLogicDir, file);
        let mq = 0;
        if (iname.endsWith("MQ.json")) mq = 1;
        LogicParser.parse(fs.readFileSync(iname).toString(), mq, write);
    });
    LogicParser.write(write);
    const logic = LogicGenerator.generate();
    const logicData = JSON.stringify(logic, null, 4);
    fs.writeFileSync(`${outputDir}/logic.full.json`, logicData);
    const filtered = filterLogic(logic);
    const filteredData = JSON.stringify(filtered, null, 4);
    fs.writeFileSync(`${outputDir}/logic.json`, filteredData);
}

// parser for glitched logic
function parseGlitchedLogic() {
    LogicParser.parse(fs.readFileSync(inGatewayFile).toString(), 0, 2);
    fs.readdirSync(inGlitchedDir).forEach(function(file) {
        const iname = path.join(inGlitchedDir, file);
        let mq = 0;
        if (iname.endsWith("MQ.json")) mq = 1;
        LogicParser.parse(fs.readFileSync(iname).toString(), mq, 2);
    });
    const logic = LogicGenerator.generate();
    const logicData = JSON.stringify(logic, null, 4);
    fs.writeFileSync(`${outputDir}/logic_glitched.full.json`, logicData);
    const filtered = filterLogic(logic);
    const filteredData = JSON.stringify(filtered, null, 4);
    fs.writeFileSync(`${outputDir}/logic_glitched.json`, filteredData);
}

// --------------------------

// parse helpers
HelperParser.parse(fs.readFileSync(inHelperFile).toString());
// parse logic
parseLogic();
// reset generator
LogicGenerator.reset();
// parse glitched logic
parseGlitchedLogic();
