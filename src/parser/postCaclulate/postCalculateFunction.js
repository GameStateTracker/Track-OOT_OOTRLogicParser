import Translation from "../../utils/Translation.js";
import {
    translateFunctionName
} from "../../utils/TranslatorFunctions.js";

export default function postCalculate(scope, input, age = "", region = "", basic = false) {
    let fnName = translateFunctionName(input.value);
    let param = input.el[0];
    if (param != null) {
        param = param.el
        const paramBuff = Translation.getValueName(param);
        if (paramBuff != null) {
            param = paramBuff.el;
        }
        fnName = `${fnName}(${param})`;
    }
    if (age != "") {
        return {
            type: "mixin",
            el: `${fnName}{${age}}`
        };
    }
    return {
        type: "mixin",
        el: fnName
    };
}
