import fs from "fs";
import path from "path";
import RandONC from "./utils/RandONC";
import RandTokenizer from "./utils/RandTokenizer";

const inDir  = path.join(__dirname, "../input/data/World");
const outDir = path.join(__dirname, "../output/data/World");

type RuleMap = { [index: string]: any }

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
    let result: RuleMap = {};
    output.forEach((value: any) => {
        let rules: RuleMap = {};
        for (let i in value.locations) {
            rules[i] = RandTokenizer.tokenize(value.locations[i]);
        }
        for (let i in value.exits) {
            rules[i] = RandTokenizer.tokenize(value.exits[i]);
        }
        result[value.region_name] = rules;
    })
    return JSON.stringify(result, null, 4);
}