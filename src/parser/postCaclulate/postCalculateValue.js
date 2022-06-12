import Translation from "../../utils/Translation.js";
import {
    translateMixinName
} from "../../utils/TranslatorFunctions.js";

const EXPECTED_REG = /item\[.*?\]/;

export default function postCalculate(scope, input, age = "", region = "", basic = false) {
    const {calc, mixins} = scope;
    if (input.el.indexOf("[") >= 0 && input.el.endsWith("]")) {
        if (input.el.startsWith("mixin[") || input.el.startsWith("function[") && age != "") {
            return {
                type: "mixin",
                el: `${input.el}{${age}}`
            };
        }
        return input;
    }
    const res = Translation.getValueName(input.el);
    if (res != null) {
        return calc(scope, res, age, region, basic);
    }
    const mixname = translateMixinName(input.el);
    if (mixins.has(mixname)) {
        if (age != "") {
            return {
                type: "mixin",
                el: `${mixname}{${age}}`
            };
        }
        return {
            type: "mixin",
            el: mixname
        };
    }
    if (!EXPECTED_REG.test(input.el)) {
        console.log(`no translation: ${input.el}`);
    }
    return input;
}
