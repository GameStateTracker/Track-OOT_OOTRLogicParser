import fs from "fs";
import path from "path";
import JSONFile from "./utils/JSONFile";
import Translation from "./utils/Translation";
import HelperParser from "./utils/parser/HelperParser";
import LogicParser from "./utils/parser/LogicParser";

// TODO load LogicHelpers.json
// TODO add "function" resolver [e.g. LogicHelpers.json > can_play(song): Ocarina and song]

const inHelperFile  = path.join(__dirname, "../input/data/LogicHelpers.json");
const outHelperFile  = path.join(__dirname, "../output/data/LogicHelpers.json");
const inLogicDir  = path.join(__dirname, "../input/data/World");
const outLogicDir  = path.join(__dirname, "../output/data/World");
const outLogicFile = path.join(__dirname, "../output/data/Logic.json");

const transRulesFile = path.join(__dirname, "../translation/rules.json");

if (!fs.existsSync(inLogicDir)) {
    fs.mkdirSync(inLogicDir, {
        recursive: true
    });
}
if (!fs.existsSync(outLogicDir)) {
    fs.mkdirSync(outLogicFile, {
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
    let fname = path.join(inLogicDir, file);
    LogicParser.parse(fs.readFileSync(fname).toString());
});

// write logic
let data = JSON.stringify(LogicParser.get(), null, 4);
fs.writeFileSync(outLogicFile, data);

// write helpers
let helper = JSON.stringify(HelperParser.get(), null, 4);
fs.writeFileSync(outHelperFile, helper);
