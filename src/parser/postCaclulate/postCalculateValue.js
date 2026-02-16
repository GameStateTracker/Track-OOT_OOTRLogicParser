import Translation from "../../utils/Translation.js";
import {translateMixinName} from "../../utils/TranslatorFunctions.js";

const EXPECTED_REG = /item\[.*?\]/;

export default function postCalculate(scope, input, age = "", region = "", basic = false) {
    const {
        calc, mixins, missingValue
    } = scope;
    if (input?.ref == null) {
        console.warn("nullsy value detected");
        return {
            type: "error",
            ref: "nullsy"
        };
    }
    if (input.ref.indexOf("[") >= 0 && input.ref.endsWith("]")) {
        if (input.ref.startsWith("mixin[") || input.ref.startsWith("function[") && age != "") {
            return {
                type: "mixin",
                ref: `${input.ref}{${age}}`
            };
        }
        if (input.ref.startsWith("eventt[")) {
            return input;
        }
    }
    const res = Translation.getValueName(input.ref);
    if (res != null) {
        return calc(scope, res, age, region, basic);
    }
    const mixname = translateMixinName(input.ref);
    if (mixins.has(mixname)) {
        if (age != "") {
            return {
                type: "mixin",
                ref: `${mixname}{${age}}`
            };
        }
        return {
            type: "mixin",
            ref: mixname
        };
    }
    if (!EXPECTED_REG.test(input.ref)) {
        missingValue.add(input.ref);
    }
    return input;
}
