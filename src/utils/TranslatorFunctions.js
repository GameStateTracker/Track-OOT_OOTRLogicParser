import Translation from "./Translation.js";

export const INDEX_DELIMITER = "--#";
export const INDEX_DELIMITER_REGEX = new RegExp(`${INDEX_DELIMITER}[0-9]*$`);

export function translateRegionName(input) {
    if (input.startsWith("region.")) return input;
    return `region.${input.toLowerCase().replace(/ /g, "_").replace(INDEX_DELIMITER_REGEX, "")}`;
}

export function translateLocationName(input) {
    if (input.startsWith("logic.")) return input;
    return `logic.${Translation.translateName(input.replace(INDEX_DELIMITER_REGEX, ""))}`;
}

export function translateEventName(input) {
    if (input.startsWith("event.")) return input;
    return `event.${input.toLowerCase().replace(/ /g, "_").replace(INDEX_DELIMITER_REGEX, "")}`;
}

export function translateMixinName(input) {
    if (input.startsWith("mixin.")) return input;
    return `mixin.${input.toLowerCase().replace(/ /g, "_")}`;
}

export function translateFunctionName(input) {
    if (input.startsWith("function.")) return input;
    return `function.${input.toLowerCase().replace(/ /g, "_")}`;
}
