import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import JSONFile from "./utils/JSONFile.js";
import Translation from "./utils/Translation.js";
import HelperParser from "./parser/HelperParser.js";
import LogicParser from "./parser/LogicParser.js";
import LogicGenerator from "./parser/LogicGenerator.js";
import { testLogic } from "./_test/TestHandler.js";

const __dirname = path.resolve();

const inGatewayFile  = path.join(__dirname, "/gateways/gateways.json");
const inHelperFile  = path.join(__dirname, "/input/data/LogicHelpers.json");
const inLogicDir  = path.join(__dirname, "/input/data/World");
const inGlitchedDir  = path.join(__dirname, "/input/data/Glitched World");
const outputDir = path.join(__dirname, "/output/");

const transRulesFile = path.join(__dirname, "/translation/predict_rules.json");

if (!fs.existsSync(inLogicDir)) {
    execSync('git clone "https://github.com/TestRunnerSRL/OoT-Randomizer.git#5.2.54" "input"');
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

// parser for normal logic
function parseLogic() {
    LogicParser.parse(fs.readFileSync(inGatewayFile).toString(), 0);
    fs.readdirSync(inLogicDir).forEach(function(file) {
        const iname = path.join(inLogicDir, file);
        let mq = 0;
        if(iname.endsWith("MQ.json")) mq = 1;
        LogicParser.parse(fs.readFileSync(iname).toString(), mq);
    });
    const logic = LogicGenerator.generate();
    testLogic(logic);
    const logicData = JSON.stringify(logic, null, 4);
    fs.writeFileSync(`${outputDir}/logic.json`, logicData);
};

// parser for glitched logic
function parseGlitchedLogic() {
    LogicParser.parse(fs.readFileSync(inGatewayFile).toString(), 0, 0);
    fs.readdirSync(inGlitchedDir).forEach(function(file) {
        const iname = path.join(inGlitchedDir, file);
        let mq = 0;
        if(iname.endsWith("MQ.json")) mq = 1;
        LogicParser.parse(fs.readFileSync(iname).toString(), mq);
    });
    const logic = LogicGenerator.generate();
    //testLogic(logic);
    const logicData = JSON.stringify(logic, null, 4);
    fs.writeFileSync(`${outputDir}/logic_glitched.json`, logicData);
};

// --------------------------

// parse helpers
HelperParser.parse(fs.readFileSync(inHelperFile).toString());
// parse logic
parseLogic();
// reset generator
LogicGenerator.reset();
// parse glitched logic
parseGlitchedLogic();