import Translation from "../../utils/Translation.js";
import {
    translateMixinName
} from "../../utils/TranslatorFunctions.js";

const EXPECTED_REG = /item\[.*?\]/;

export default function postCalculate(scope, input, region = "", basic = false) {
    const {
        calc, mixins, missingValue
    } = scope;
    if (input.ref.indexOf("[") >= 0 && input.ref.endsWith("]")) {
        if (input.ref.startsWith("mixin[")) {
            return {
                type: "function",
                ref: input.ref
            };
        }
        if (input.ref.startsWith("function[")) {
            return {
                type: "function",
                ref: input.ref,
                params: input.params ?? []
            };
        }
        return input;
    }
    const res = Translation.getValueName(input.ref);
    if (res != null) {
        if (Array.isArray(res)) {
            return res.map((entry) => calc(scope, entry, region, basic));
        }
        return calc(scope, res, region, basic);
    }
    const mixname = translateMixinName(input.ref);
    if (mixins.has(mixname)) {
        return {
            type: "function",
            ref: mixname
        };
    }
    if (!EXPECTED_REG.test(input.ref)) {
        missingValue.add(input.ref);
    }
    return input;
}
