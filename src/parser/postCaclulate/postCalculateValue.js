import path from "path";
import JSONCFile from "../../utils/JSONCFile.js";
import Translation from "../../utils/Translation.js";
import {translateMixinName} from "../../utils/TranslatorFunctions.js";

const __dirname = path.resolve();

const ignoredValueMatchers = JSONCFile.read(path.join(__dirname, "/config/ignoredValueMatchers.json"), []);

const ignoredValues = [];
for (const matcher of ignoredValueMatchers) {
    ignoredValues.push(new RegExp(matcher));
}

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
        if (input.ref.startsWith("event[")) {
            return input;
        }
    }
    const resEv = Translation.translateEvent(input.ref);
    if (resEv != null) {
        return {
            type: "value",
            ref: resEv
        };
    }
    const resVal = Translation.getValueName(input.ref);
    if (resVal != null) {
        return calc(scope, resVal, age, region, basic);
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
    const knownValue = ignoredValues.some((matcher) => matcher.test(input.ref));
    if (!knownValue) {
        missingValue.add(input.ref);
    }
    return input;
}
