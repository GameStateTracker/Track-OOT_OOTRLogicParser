import {
    translateMixinName
} from "../../utils/TranslatorFunctions.js";

export default function postCalculate(scope, input/* , region = "", basic = false */) {
    const fnName = translateMixinName(input.ref);
    return {
        type: "function",
        ref: fnName
    };
}
