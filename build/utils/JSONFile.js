"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var JSONFile = /** @class */ (function () {
    function JSONFile() {
    }
    JSONFile.read = function (filename, def) {
        if (fs_1.default.existsSync(filename)) {
            var data = fs_1.default.readFileSync(filename).toString();
            return JSON.parse(data);
        }
        return def;
    };
    JSONFile.write = function (filename, data) {
        fs_1.default.writeFileSync(filename, JSON.stringify(data, null, 4));
    };
    return JSONFile;
}());
exports.default = JSONFile;
