import Translation from "../../utils/Translation.js";

const INTERNAL_REGEXP = /(?:option|filter|randomized|arealist)\[[^[\]]+\]/;

export default function postCalculate(scope, input, age = ""/* , region = "", basic = false */) {
    const {missingState} = scope;
    if (input.ref == "age" && age != "") {
        if (input.value == age) {
            return {type: "true"};
        } else {
            return {type: "false"};
        }
    }
    const stapar = input.value.replace(/^'|'$/g, "");
    const sta = Translation.getStateConfig(input.ref);
    if (sta == null) {
        if (!INTERNAL_REGEXP.test(input.ref)) {
            const state = missingState.get(input.ref) ?? {
                name: "",
                values: {}
            };
            missingState.set(input.ref, state);
            state.values[stapar] = "";
        }
        return {
            type: "state",
            ref: input.ref,
            value: stapar
        };
    } else {
        const value = sta.values[stapar];
        if (value == null) {
            if (!INTERNAL_REGEXP.test(input.ref)) {
                const state = missingState.get(input.ref) ?? {
                    name: sta.name,
                    values: {}
                };
                missingState.set(input.ref, state);
                state.values[stapar] = "";
            }
            return {
                type: "state",
                ref: sta.name,
                value: stapar
            };
        } else if (typeof value === "object") {
            return value;
        } else {
            return {
                type: "state",
                ref: sta.name,
                value: value
            };
        }
    }
}
