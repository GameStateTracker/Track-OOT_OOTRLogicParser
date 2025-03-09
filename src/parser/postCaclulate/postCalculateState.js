import Translation from "../../utils/Translation.js";

export default function postCalculate(scope, input/* , region = "", basic = false */) {
    const {
        missingState
    } = scope;
    const stapar = input.value.replace(/^'|'$/g, "");
    const sta = Translation.getStateConfig(input.ref);
    if (sta == null) {
        const state = missingState.get(input.ref) ?? {
            name: "",
            values: {}
        };
        missingState.set(input.ref, state);
        state.values[stapar] = "";
        return {
            type: "state",
            ref: input.ref,
            value: stapar
        };
    } else {
        const value = sta.values[stapar];
        if (value == null) {
            const state = missingState.get(input.ref) ?? {
                name: sta.name,
                values: {}
            };
            missingState.set(input.ref, state);
            state.values[stapar] = "";
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
