"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var RandONC_1 = __importDefault(require("./utils/RandONC"));
var RandTokenizer_1 = __importDefault(require("./utils/RandTokenizer"));
var LogicBuilder_1 = __importDefault(require("./utils/LogicBuilder"));
var Translation_1 = __importDefault(require("./utils/Translation"));
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
            var rule = value.locations[i];
            rule = transpileRule(rule);
            rules[Translation_1.default.translate(i)] = rule;
        }
        for (var i in value.exits) {
            var rule = value.exits[i];
            rule = transpileRule(rule);
            rules[Translation_1.default.translate(i)] = rule;
        }
        result[Translation_1.default.translate(value.region_name)] = rules;
    });
    return JSON.stringify(result, null, 4);
}
function transpileRule(input) {
    var token = RandTokenizer_1.default.tokenize(input);
    return LogicBuilder_1.default.build(token);
}
