import fs from "fs";
import path from "path";
import {
    execSync
} from "child_process";
import JSONFile from "./utils/JSONFile.js";
import Translation from "./utils/Translation.js";
import HelperParser from "./parser/HelperParser.js";
import LogicParser from "./parser/LogicParser.js";
import LogicGenerator from "./parser/LogicGenerator.js";
import {
    filterLogic, filterMixins
} from "./_test/LogicTester.js";
import {
    filterFailedMixins
} from "./_test/RemoveBadLogic.js";
import {
    reduceLogic
} from "./_test/LogicReducer.js";
import {
    gatewayData
} from "./utils/GatewayLoader.js";

const __dirname = path.resolve();

/* SETTINGS */
const RANDO_VERSION = "Dev";
const FILTER_LOGIC = false;
/* -------- */

const inHelperFile  = path.join(__dirname, "/input/data/LogicHelpers.json");
const inLogicDir  = path.join(__dirname, "/input/data/World");
const inGlitchedDir  = path.join(__dirname, "/input/data/Glitched World");
const outputDir = path.join(__dirname, "/output/");

const transRulesFile = path.join(__dirname, "/translation/predict_rules.json");

if (fs.existsSync("./input")) {
    fs.rmSync("./input", {recursive: true});
}
execSync(`git clone --branch "${RANDO_VERSION}" "https://github.com/TestRunnerSRL/OoT-Randomizer.git" "input"`);

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, {recursive: true});
}

// set translation rules
const rules = new Map(Object.entries(JSONFile.read(transRulesFile, {})));
rules.forEach((v, k) => {
    Translation.addRule(new RegExp(k, "i"), new RegExp(v, "i"));
});

// parser for normal logic
function parseLogic() {
    console.log("");
    console.log("===========================================");
    console.log("PARSE LOGIC");
    console.log("");
    LogicGenerator.reset();
    LogicParser.parse(gatewayData);
    fs.readdirSync(inLogicDir).forEach(function(file) {
        const iname = path.join(inLogicDir, file);
        let mq = false;
        if (iname.endsWith("MQ.json")) {
            mq = true;
        }
        LogicParser.parseFile(iname, mq, [
            / Boss Door$/
        ]);
    });
    LogicParser.addCustomLogic();
    LogicParser.regionCheckCall();
    const logic = LogicGenerator.generate();
    const logicData = JSON.stringify(logic, null, 4);
    fs.writeFileSync(`${outputDir}/vanilla.full.json`, logicData);

    /* filter */
    const [success, failed] = filterMixins(logic);
    const filteredLogic = filterLogic(success);
    const filtered = filterFailedMixins([filteredLogic, failed]);
    const filteredData = JSON.stringify(filtered, null, 4);
    fs.writeFileSync(`${outputDir}/vanilla.filtered.json`, filteredData);

    /* reduce */
    const reducedLogic = reduceLogic(FILTER_LOGIC ? filtered : logic);
    const reducedLogicData = JSON.stringify(reducedLogic, null, 4);
    fs.writeFileSync(`${outputDir}/vanilla.readable.json`, reducedLogicData);

    /* minify */
    const minifiedLogicData = JSON.stringify(reducedLogic);
    fs.writeFileSync(`${outputDir}/vanilla.min.json`, minifiedLogicData);
}

// parser for glitched logic
function parseGlitchedLogic() {
    console.log("");
    console.log("===========================================");
    console.log("PARSE GLITCHED LOGIC");
    console.log("");
    LogicGenerator.reset();
    LogicParser.parse(gatewayData);
    fs.readdirSync(inGlitchedDir).forEach(function(file) {
        const iname = path.join(inGlitchedDir, file);
        let mq = false;
        if (iname.endsWith("MQ.json")) {
            mq = true;
        }
        LogicParser.parseFile(iname, mq, [
            / Boss Door$/
        ]);
    });
    LogicParser.addCustomLogic();
    // LogicParser.regionCheckCall();
    const logic = LogicGenerator.generate(true);
    const logicData = JSON.stringify(logic, null, 4);
    fs.writeFileSync(`${outputDir}/glitched.full.json`, logicData);

    /* filter */
    const [success, failed] = filterMixins(logic);
    const filteredLogic = filterLogic(success);
    const filtered = filterFailedMixins([filteredLogic, failed]);
    const filteredData = JSON.stringify(filtered, null, 4);
    fs.writeFileSync(`${outputDir}/glitched.filtered.json`, filteredData);

    /* reduce */
    const reducedLogic = reduceLogic(FILTER_LOGIC ? filtered : logic);
    const reducedLogicData = JSON.stringify(reducedLogic, null, 4);
    fs.writeFileSync(`${outputDir}/glitched.readable.json`, reducedLogicData);

    /* minify */
    const minifiedLogicData = JSON.stringify(reducedLogic);
    fs.writeFileSync(`${outputDir}/glitched.min.json`, minifiedLogicData);
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
