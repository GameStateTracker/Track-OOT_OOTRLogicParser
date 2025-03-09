import postCalculateValue from "./postCalculateValue.js";
import postCalculateFunction from "./postCalculateFunction.js";
import postCalculateMixin from "./postCalculateMixin.js";
import postCalculateState from "./postCalculateState.js";
import postCalculateMinMax from "./postCalculateMinMax.js";
import {
    translateRegionName
} from "../../utils/TranslatorFunctions.js";

function calc(scope, input, region = "", basic = false) {
    switch (input.type) {
        case "value": {
            return postCalculateValue(scope, input, region, basic);
        }
        case "state": {
            return postCalculateState(scope, input, region, basic);
        }
        case "mixin": {
            return postCalculateMixin(scope, input, region, basic);
        }
        case "function": {
            return postCalculateFunction(scope, input, region, basic);
        }
        case "at": {
            return {
                "type": "at",
                "node": translateRegionName(input.node),
                "content": input.content
            };
        }
        case "here": {
            return {
                "type": "at",
                "node": translateRegionName(region),
                "content": input.content
            };
        }
        case "and":
        case "nand":
        case "or":
        case "nor":
        case "xor":
        case "xnor":
        case "add":
        case "sub":
        case "mul":
        case "div":
        case "mod":
        case "pow":
        case "eq":
        case "neq":
        case "gt":
        case "gte":
        case "lt":
        case "lte": {
            const els = [];
            for (const el of input.content) {
                els.push(postCalculate(scope, el, region, basic));
            }
            return {
                type: input.type,
                content: els
            };
        }
        case "min":
        case "max": {
            return postCalculateMinMax(scope, input, region, basic);
        }
        case "not": {
            return {
                type: "not",
                content: postCalculate(scope, input.content, region, basic)
            };
        }
        default: {
            return input;
        }
    }
}

export default function postCalculate(scope, input, region, basic) {
    return calc({
        ...scope,
        calc
    }, input, region, basic);
}
