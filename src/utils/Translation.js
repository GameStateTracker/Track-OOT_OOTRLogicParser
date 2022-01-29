import path from "path";
import JSONFile from "./JSONFile.js";
import JSONCFile from "./JSONCFile.js";

const __dirname = path.resolve();

const predict_path = path.join(__dirname, "/translation/predicted.json");
const unpredict_path = path.join(__dirname, "/translation/unpredict.json");
const translation = JSONCFile.read(path.join(__dirname, "/translation/trans.jsonc"), {});
let predict_values = JSONFile.read(path.join(__dirname, "/translation/predict_values.json"), []);
const predict = {}
const unpredict = JSONFile.read(unpredict_path, []);

const values = JSONCFile.read(path.join(__dirname, "/translation/values.jsonc"), {});
const states = JSONCFile.read(path.join(__dirname, "/translation/states.jsonc"), {});

const rules = new Map();

predict_values = predict_values.filter(el => !(new Set(Object.values(translation))).has(el));

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

    getValueName(value) {
        value = value.replace(/ /g, "_").replace(/^'|'$/g, "");
        if (values[value] != null) {
            const res = values[value];
            return res;
        }
    }

    getStateConfig(value) {
        value = value.replace(/ /g, "_").replace(/^'|'$/g, "");
        if (states[value] != null) {
            const res = states[value];
            return res;
        }
    }

}

function predictTranslation(value, expects) {
    const results = {};
    if (expects == null) {
        rules.forEach((v, k) => {
            if (value.match(k)) {
                expects = v;
            }
        });
    }
    for (const i of predict_values) {
        if (expects != null && !i.match(expects)) {
            continue;
        }
        results[i] = calculateLevDistance(value, i);
    }
    let cost = Number.MAX_SAFE_INTEGER;
    let res = value;
    for (const i in results) {
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
    let realCost;

    let srcLength = src.length,
        tgtLength = tgt.length,
        tempString, tempLength; // for swapping

    const resultMatrix = new Array();
    resultMatrix[0] = new Array(); // Multi dimensional

    // To limit the space in minimum of source and target,
    // we make sure that srcLength is greater than tgtLength
    if (srcLength < tgtLength) {
        tempString = src; src = tgt; tgt = tempString;
        tempLength = srcLength; srcLength = tgtLength; tgtLength = tempLength;
    }

    for (let c = 0; c < tgtLength + 1; c++) {
        resultMatrix[0][c] = c;
    }

    for (let i = 1; i < srcLength + 1; i++) {
        resultMatrix[i] = new Array();
        resultMatrix[i][0] = i;
        for (let j = 1; j < tgtLength + 1; j++) {
            realCost = src.charAt(i - 1) == tgt.charAt(j - 1) ? 0 : 1;
            resultMatrix[i][j] = Math.min(
                resultMatrix[i - 1][j] + 1,
                resultMatrix[i][j - 1] + 1,
                resultMatrix[i - 1][j - 1] + realCost // same logic as our previous example.
            );
        }
    }

    return resultMatrix[srcLength][tgtLength];
}

export default new Translation();
