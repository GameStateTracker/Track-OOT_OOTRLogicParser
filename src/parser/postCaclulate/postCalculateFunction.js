import Translation from "../../utils/Translation.js";
import {
    translateFunctionName
} from "../../utils/TranslatorFunctions.js";

export default function postCalculate(scope, input, age = ""/* , region = "", basic = false */) {
    let fnName = translateFunctionName(input.value);
    let param = input.content[0];
    if (param != null) {
        param = param.content
        const paramBuff = Translation.getValueName(param);
        if (paramBuff != null) {
            param = paramBuff.content;
        }
        fnName = `${fnName}(${param})`;
    }
    if (age != "") {
        return {
            type: "mixin",
            content: `${fnName}{${age}}`
        };
    }
    return {
        type: "mixin",
        content: fnName
    };
}
