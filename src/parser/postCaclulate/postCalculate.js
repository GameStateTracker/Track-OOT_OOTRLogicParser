import createOnRegionLogic from "./createOnRegionLogic.js";
import postCalculateMixin from "./postCalculateMixin.js";
import postCalculateValue from "./postCalculateValue.js";
import postCalculateFunction from "./postCalculateFunction.js";
import postCalculateState from "./postCalculateState.js";
import postCalculateMinMax from "./postCalculateMinMax.js";
import {
    translateRegionName
} from "../../utils/TranslatorFunctions.js";

export default function postCalculate(scope, input, age = "", region = "", basic = false) {
    const els = [];
    switch (input.type) {
        case "mixin":
            return postCalculateMixin({...scope, postCalculate}, input, age, region, basic);
        case "value":
            return postCalculateValue({...scope, postCalculate}, input, age = "", region = "", basic = false);
        case "state":
            return postCalculateState({...scope, postCalculate}, input, age = "", region = "", basic = false);
        case "function":
            return postCalculateFunction({...scope, postCalculate}, input, age = "", region = "", basic = false);
        case "at":
            return createOnRegionLogic(
                `${translateRegionName(input.node)}[child]`,
                postCalculate(input.el, "child", region, basic),
                `${translateRegionName(input.node)}[adult]`,
                postCalculate(input.el, "adult", region, basic),
                basic
            );
        case "here":
            return createOnRegionLogic(
                `${translateRegionName(region)}[child]`,
                postCalculate(input.el, "child", region, basic),
                `${translateRegionName(region)}[adult]`,
                postCalculate(input.el, "adult", region, basic),
                basic
            );
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
            for (const el of input.el) {
                els.push(postCalculate(el, age, region, basic));
            }
            return {
                type: input.type,
                el: els
            };
        case "min":
        case "max":
            return postCalculateMinMax({...scope, postCalculate}, input, age = "", region = "", basic = false);
        case "not":
            return {
                type: "not",
                el: postCalculate(input.el, age, region, basic)
            };
        default:
            return input;
    }
}
