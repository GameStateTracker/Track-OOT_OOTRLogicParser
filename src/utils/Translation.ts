import path from "path";
import JSONFile from "./JSONFile";
import JSONCFile from "./JSONCFile";

const predict_path = path.join(__dirname, "../../translation/predict.json");
const unpredict_path = path.join(__dirname, "../../translation/unpredict.json");
const translation: JSONCMap = <JSONCMap> JSONCFile.read(path.join(__dirname, "../../translation/trans.jsonc"), {});
const values: string[] = <string[]> JSONFile.read(path.join(__dirname, "../../translation/values.json"), []);
const predict: {[index: string]: string} = {}
const unpredict: string[] = <string[]> JSONFile.read(unpredict_path, []);

const overrides: JSONCMap = <JSONCMap> JSONCFile.read(path.join(__dirname, "../../translation/overrides.jsonc"), {});

export default abstract class Translation {

    private static rules: Map<RegExp, RegExp> = new Map();

    public static addRule(matches: RegExp, expects: RegExp): void {
        Translation.rules.set(matches, expects);
    }

    public static translateName(value: string, expects?: RegExp): string {
        if (translation[value] != null) {
            return <string> translation[value];
        }

        return Translation.predict(value, expects);
    }

    public static getOverride(value: string): JSONCObject | void {
        value = value.replace(/ /g, "_").replace(/^'|'$/, "");
        if (overrides[value] != null) {
            let res = overrides[value];
            return res;
        }
    }

    private static predict(value: string, expects?: RegExp): string {
        let results: { [index: string]: number } = {};
        if (expects == null) {
            Translation.rules.forEach((v, k) => {
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

}

function calculateLevDistance(src: string, tgt: string): number {
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