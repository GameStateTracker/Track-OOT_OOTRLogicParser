import path from "path";
import JSONFile from "./JSONFile.js";
import JSONCFile from "./JSONCFile.js";

const __dirname = path.resolve();

const predict_path = path.join(__dirname, "/translation/predict.json");
const unpredict_path = path.join(__dirname, "/translation/unpredict.json");
const translation = JSONCFile.read(path.join(__dirname, "/translation/trans.jsonc"), {});
const values = JSONFile.read(path.join(__dirname, "/translation/values.json"), []);
const predict = {}
const unpredict = JSONFile.read(unpredict_path, []);

const overrides = JSONCFile.read(path.join(__dirname, "/translation/overrides.jsonc"), {});

let rules = new Map();

class Translation {

    addRule(matches, expects) {
        rules.set(matches, expects);
    }

    translateName(value, expects) {
        if (translation[value] != null) {
            return translation[value];
        }

        return predictTranslation(value, expects);
    }

    getOverride(value) {
        value = value.replace(/ /g, "_").replace(/^'|'$/, "");
        if (overrides[value] != null) {
            let res = overrides[value];
            return res;
        }
    }

}

function predictTranslation(value, expects) {
    let results = {};
    if (expects == null) {
        rules.forEach((v, k) => {
            if (value.match(k)) {
                expects = v;
            }
        });
    }
    for (let i of values) {
        if (expects != null && !i.match(expects)) {
            continue;
        }
        results[i] = calculateLevDistance(value, i);
    }
    let cost = Number.MAX_SAFE_INTEGER;
    let res = value;
    for (let i in results) {
        if (cost > results[i]) {
            cost = results[i];
            res = i;
        }
    }
    if (value == res) {
        unpredict.push(value);
        JSONFile.write(unpredict_path, unpredict);
    } else {
        predict[value] = res;
        JSONFile.write(predict_path, predict);
    }
    return res;
}

function calculateLevDistance(src, tgt) {
    var realCost;
    
    var srcLength = src.length,
        tgtLength = tgt.length,
        tempString, tempLength; // for swapping
    
    var resultMatrix = new Array();
        resultMatrix[0] = new Array(); // Multi dimensional
    
    // To limit the space in minimum of source and target,
    // we make sure that srcLength is greater than tgtLength
    if (srcLength < tgtLength) {
        tempString = src; src = tgt; tgt = tempString;
        tempLength = srcLength; srcLength = tgtLength; tgtLength = tempLength;
    }
    
    for (var c = 0; c < tgtLength+1; c++) {
        resultMatrix[0][c] = c;
    }
    
    for (var i = 1; i < srcLength+1; i++) {
        resultMatrix[i] = new Array();
        resultMatrix[i][0] = i;
        for (var j = 1; j < tgtLength+1; j++) {
            realCost = (src.charAt(i-1) == tgt.charAt(j-1))? 0: 1;
            resultMatrix[i][j] = Math.min(
                resultMatrix[i-1][j]+1,
                resultMatrix[i][j-1]+1,
                resultMatrix[i-1][j-1] + realCost // same logic as our previous example.
            ); 
        }
    }
    
    return resultMatrix[srcLength][tgtLength];
}

export default new Translation();