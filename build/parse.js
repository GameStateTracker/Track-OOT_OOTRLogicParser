"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var RandONC_1 = __importDefault(require("./utils/RandONC"));
var RandTokenizer_1 = __importDefault(require("./utils/RandTokenizer"));
var inDir = path_1.default.join(__dirname, "../input/data/World");
var outDir = path_1.default.join(__dirname, "../output/data/World");
if (!fs_1.default.existsSync(inDir)) {
    fs_1.default.mkdirSync(inDir, {
        recursive: true
    });
}
if (!fs_1.default.existsSync(outDir)) {
    fs_1.default.mkdirSync(outDir, {
        recursive: true
    });
}
var files = fs_1.default.readdirSync(inDir);
files.forEach(function (file) {
    var data = fs_1.default.readFileSync(path_1.default.join(inDir, file)).toString();
    data = parse(data);
    fs_1.default.writeFileSync(path_1.default.join(outDir, file), data);
});
function parse(input) {
    var output = RandONC_1.default.parse(input);
    var result = {};
    output.forEach(function (value) {
        var rules = {};
        for (var i in value.locations) {
            rules[i] = RandTokenizer_1.default.tokenize(value.locations[i]);
        }
        for (var i in value.exits) {
            rules[i] = RandTokenizer_1.default.tokenize(value.exits[i]);
        }
        result[value.region_name] = rules;
    });
    return JSON.stringify(result, null, 4);
}
