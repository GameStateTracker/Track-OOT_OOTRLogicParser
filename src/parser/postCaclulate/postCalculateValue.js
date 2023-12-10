import Translation from "../../utils/Translation.js";
import {
    translateMixinName
} from "../../utils/TranslatorFunctions.js";

const EXPECTED_REG = /item\[.*?\]/;

export default function postCalculate(scope, input, age = "", region = "", basic = false) {
    const {calc, mixins, missingValue} = scope;
    if (input.content.indexOf("[") >= 0 && input.content.endsWith("]")) {
        if (input.content.startsWith("mixin[") || input.content.startsWith("function[") && age != "") {
            return {
                type: "mixin",
                content: `${input.content}{${age}}`
            };
        }
        return input;
    }
    const res = Translation.getValueName(input.content);
    if (res != null) {
        return calc(scope, res, age, region, basic);
    }
    const mixname = translateMixinName(input.content);
    if (mixins.has(mixname)) {
        if (age != "") {
            return {
                type: "mixin",
                content: `${mixname}{${age}}`
            };
        }
        return {
            type: "mixin",
            content: mixname
        };
    }
    if (!EXPECTED_REG.test(input.content)) {
        missingValue.add(input.content);
    }
    return input;
}
