import path from "path";
import JSONFile from "./JSONFile";

const predict_path = path.join(__dirname, "../../translation/predict.json");
const translation: { [index: string]: any } = JSONFile.read(path.join(__dirname, "../../translation/trans.json"), {});
const values: [string] = JSONFile.read(path.join(__dirname, "../../translation/values.json"), []);
const predict = JSONFile.read(predict_path, {});

export default class Translation {

    private constructor() { }

    public static translate(value: string): string {
        if (translation[value] != null) {
            return translation[value];
        }

        return Translation.predict(value);
    }

    private static predict(value: string): string {
        let results: { [index: string]: number } = {};
        for (let i of values) {
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
        predict[value] = res;
        JSONFile.write(predict_path, predict);
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