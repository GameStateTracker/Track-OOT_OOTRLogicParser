import Translation from "../../utils/Translation.js";
import {
    translateFunctionName
} from "../../utils/TranslatorFunctions.js";

export default function postCalculate(scope, input, age = ""/* , region = "", basic = false */) {
    let fnName = translateFunctionName(input.ref);
    let param = input.params[0];
    if (param != null) {
        param = param.ref;
        const paramBuff = Translation.getValueName(param);
        if (paramBuff != null) {
            param = paramBuff.ref;
        }
        fnName = `${fnName}(${param})`;
    }
    if (age != "") {
        return {
            type: "mixin",
            ref: `${fnName}{${age}}`
        };
    }
    return {
        type: "mixin",
        ref: fnName
    };
}
