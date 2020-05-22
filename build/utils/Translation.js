"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var JSONFile_1 = __importDefault(require("./JSONFile"));
var predict_path = path_1.default.join(__dirname, "../../conf/predict.json");
var translation = JSONFile_1.default.read(path_1.default.join(__dirname, "../../conf/trans.json"), {});
var values = JSONFile_1.default.read(path_1.default.join(__dirname, "../../conf/values.json"), []);
var predict = JSONFile_1.default.read(predict_path, {});
var Translation = /** @class */ (function () {
    function Translation() {
    }
    Translation.translate = function (value) {
        if (translation[value] != null) {
            return translation[value];
        }
        return Translation.predict(value);
    };
    Translation.predict = function (value) {
        var results = {};
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var i = values_1[_i];
            results[i] = calculateLevDistance(value, i);
        }
        var cost = Number.MAX_SAFE_INTEGER;
        var res = value;
        for (var i in results) {
            if (cost > results[i]) {
                cost = results[i];
                res = i;
            }
        }
        predict[value] = res;
        JSONFile_1.default.write(predict_path, predict);
        return res;
    };
    return Translation;
}());
exports.default = Translation;
function calculateLevDistance(src, tgt) {
    var realCost;
    var srcLength = src.length, tgtLength = tgt.length, tempString, tempLength; // for swapping
    var resultMatrix = new Array();
    resultMatrix[0] = new Array(); // Multi dimensional
    // To limit the space in minimum of source and target,
    // we make sure that srcLength is greater than tgtLength
    if (srcLength < tgtLength) {
        tempString = src;
        src = tgt;
        tgt = tempString;
        tempLength = srcLength;
        srcLength = tgtLength;
        tgtLength = tempLength;
    }
    for (var c = 0; c < tgtLength + 1; c++) {
        resultMatrix[0][c] = c;
    }
    for (var i = 1; i < srcLength + 1; i++) {
        resultMatrix[i] = new Array();
        resultMatrix[i][0] = i;
        for (var j = 1; j < tgtLength + 1; j++) {
            realCost = (src.charAt(i - 1) == tgt.charAt(j - 1)) ? 0 : 1;
            resultMatrix[i][j] = Math.min(resultMatrix[i - 1][j] + 1, resultMatrix[i][j - 1] + 1, resultMatrix[i - 1][j - 1] + realCost // same logic as our previous example.
            );
        }
    }
    return resultMatrix[srcLength][tgtLength];
}
