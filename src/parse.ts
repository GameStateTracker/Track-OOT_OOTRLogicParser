import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import JSONFile from "./utils/JSONFile";
import Translation from "./utils/Translation";
import HelperParser from "./parser/HelperParser";
import LogicParser from "./parser/LogicParser";
import LogicGenerator from "./parser/LogicGenerator";

// TODO load LogicHelpers.json
// TODO add "function" resolver [e.g. LogicHelpers.json > can_play(song): Ocarina and song]

const inHelperFile  = path.join(__dirname, "../input/data/LogicHelpers.json");
const inLogicDir  = path.join(__dirname, "../input/data/World");
const outputDir = path.join(__dirname, "../output/");

const transRulesFile = path.join(__dirname, "../translation/rules.json");

if (!fs.existsSync(inLogicDir)) {
    execSync('git clone "https://github.com/TestRunnerSRL/OoT-Randomizer.git" "input"');
} else {
    execSync('cd input && git pull');
}
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, {
        recursive: true
    });
}

// set translation rules
const rules: Map<string, string> = new Map(Object.entries(JSONFile.read(transRulesFile, {})));
rules.forEach((v: string, k: string) => {
    Translation.addRule(new RegExp(k, "i"), new RegExp(v, "i"));
});

// parse logic
HelperParser.parse(fs.readFileSync(inHelperFile).toString());
fs.readdirSync(inLogicDir).forEach(function(file: string): void {
    let iname = path.join(inLogicDir, file);
    LogicParser.parse(fs.readFileSync(iname).toString());
});

// write logic
let logic = JSON.stringify(LogicGenerator.generate(), null, 4);
fs.writeFileSync(`${outputDir}/Logic.json`, logic);