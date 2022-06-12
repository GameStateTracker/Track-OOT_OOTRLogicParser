import createOnRegionLogic from "./createOnRegionLogic.js";
import postCalculateMixin from "./postCalculateMixin.js";
import postCalculateValue from "./postCalculateValue.js";
import postCalculateFunction from "./postCalculateFunction.js";
import postCalculateState from "./postCalculateState.js";
import postCalculateMinMax from "./postCalculateMinMax.js";
import {
    translateRegionName
} from "../../utils/TranslatorFunctions.js";

function calc(scope, input, age = "", region = "", basic = false) {
    switch (input.type) {
        case "mixin": {
            return postCalculateMixin(scope, input, age, region, basic);
        }
        case "value": {
            return postCalculateValue(scope, input, age, region, basic);
        }
        case "state": {
            return postCalculateState(scope, input, age, region, basic);
        }
        case "function": {
            return postCalculateFunction(scope, input, age, region, basic);
        }
        case "at": {
            return createOnRegionLogic(
                `${translateRegionName(input.node)}{child}`,
                postCalculate(scope, input.el, "child", region, basic),
                `${translateRegionName(input.node)}{adult}`,
                postCalculate(scope, input.el, "adult", region, basic),
                basic
            );
        }
        case "here": {
            return createOnRegionLogic(
                `${translateRegionName(region)}{child}`,
                postCalculate(scope, input.el, "child", region, basic),
                `${translateRegionName(region)}{adult}`,
                postCalculate(scope, input.el, "adult", region, basic),
                basic
            );
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
            for (const el of input.el) {
                els.push(postCalculate(scope, el, age, region, basic));
            }
            return {
                type: input.type,
                el: els
            };
        }
        case "min":
        case "max": {
            return postCalculateMinMax(scope, input, age, region, basic);
        }
        case "not": {
            return {
                type: "not",
                el: postCalculate(scope, input.el, age, region, basic)
            };
        }
        default: {
            return input;
        }
    }
}

export default function postCalculate(scope, input, age, region, basic) {
    return calc({...scope, calc}, input, age, region, basic);
}
