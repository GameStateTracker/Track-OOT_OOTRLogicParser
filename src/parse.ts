import fs from "fs";
import path from "path";
import RandONC from "./utils/RandONC";
import RandTokenizer from "./utils/RandTokenizer";
import LogicBuilder from "./utils/LogicBuilder";
import Translation from "./utils/Translation";

// TODO load LogicHelpers.json
// TODO add "function" resolver [e.g. LogicHelpers.json > can_play(song): Ocarina and song]

const inDir  = path.join(__dirname, "../input/data/World");
const outDir = path.join(__dirname, "../output/data/World");

declare global {
    type JSONValues = string | number | boolean | JSONObject;
    type JSONObject = { [index: string]: JSONValues | JSONValues[] };
    type JSONLogic = {
        type: string,
        el?: string | JSONLogic | JSONLogic[],
        value?: string | number,
        category?: string
    };
}

if (!fs.existsSync(inDir)) {
    fs.mkdirSync(inDir, {
        recursive: true
    });
}
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, {
        recursive: true
    });
}

let files = fs.readdirSync(inDir);

files.forEach(function(file: string): void {
    let data = fs.readFileSync(path.join(inDir, file)).toString();
    data = parse(data);
    fs.writeFileSync(path.join(outDir, file), data);
});

function parse(input: string): string {
    let output = RandONC.parse(input);
    let result: JSONObject = {};
    output.forEach((value: any) => {
        let rules: JSONObject = {};
        for (let i in value.locations) {
            let rule = value.locations[i];
            rule = transpileRule(rule);
            rules[Translation.translate(i)] = rule;
        }
        for (let i in value.exits) {
            let rule = value.exits[i];
            rule = transpileRule(rule);
            rules[Translation.translate(i)] = rule;
        }
        result[Translation.translate(value.region_name)] = rules;
    })
    return JSON.stringify(result, null, 4);
}

function transpileRule(input: string): JSONLogic {
    let token = RandTokenizer.tokenize(input);
    return LogicBuilder.build(token);
}