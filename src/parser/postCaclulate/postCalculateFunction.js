import {translateFunctionName} from "../../utils/TranslatorFunctions.js";

export default function postCalculate(scope, input, age = "", region = "", basic = false) {
    const {calc} = scope;
    const fnName = translateFunctionName(input.ref);

    const params = [];
    if ("params" in input) {
        for (const param of input.params) {
            params.push(calc(scope, param, age, region, basic));
        }
    }

    if (age != "") {
        return {
            type: "function",
            ref: `${fnName}{${age}}`,
            params
        };
    }
    return {
        type: "function",
        ref: fnName,
        params
    };
}
