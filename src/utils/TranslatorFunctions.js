import Translation from "./Translation.js";

export function translateRegionName(input) {
    if (input.startsWith("region[") && input.endsWith("]")) {
        return input;
    }
    return `region[${input.toLowerCase().replace(/ /g, "_")}]`;
}

export function translateLocationName(input) {
    if (input.startsWith("reach_location[") && input.endsWith("]")) {
        return input;
    }
    const result = Translation.translateName(input);
    if (result) {
        return `reach_location[${result}]`;
    }
}

export function translateEventName(input) {
    if (input.startsWith("event[") && input.endsWith("]")) {
        return input;
    }
    return `event[${input.toLowerCase().replace(/ /g, "_")}]`;
}

export function translateMixinName(input) {
    if (input.startsWith("mixin[") && input.endsWith("]")) {
        return input;
    }
    return `mixin[${input.toLowerCase().replace(/ /g, "_")}]`;
}

export function translateFunctionName(input) {
    if (input.startsWith("function[") && input.endsWith("]")) {
        return input;
    }
    return `function[${input.toLowerCase().replace(/ /g, "_")}]`;
}
