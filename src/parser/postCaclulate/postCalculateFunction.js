import {
    translateFunctionName
} from "../../utils/TranslatorFunctions.js";

export default function postCalculate(scope, input, region = "", basic = false) {
    const fnName = translateFunctionName(input.ref);
    if (input.params == null) {
        return {
            type: "function",
            ref: fnName
        };
    }
    const params = parseParams(input.params, scope, region, basic);
    return {
        type: "function",
        ref: fnName,
        params
    };
}

function parseParams(params, scope, region, basic) {
    const {
        calc
    } = scope;
    if (typeof params == "object" && params != null) {
        if (Array.isArray(params)) {
            return params.map((value) => {
                return calc(scope, value);
            });
        } else {
            const res = {};
            for (const name in params) {
                res[name] = calc(scope, params[name], region, basic);
            }
            return res;
        }
    }
    return {};
}
