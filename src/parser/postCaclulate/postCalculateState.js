import Translation from "../../utils/Translation.js";

export default function postCalculate(scope, input, age = ""/* , region = "", basic = false */) {
    const {missingState} = scope;
    if (input.el == "age" && age != "") {
        if (input.value == age) {
            return {type: "true"};
        } else {
            return {type: "false"};
        }
    }
    const stapar = input.value.replace(/^'|'$/g, "");
    const sta = Translation.getStateConfig(input.el);
    if (sta == null) {
        const state = missingState.get(input.el) ?? {
            name: "",
            values: {}
        };
        missingState.set(input.el, state);
        state.values[stapar] = "";
        return {
            type: "state",
            el: input.el,
            value: stapar
        };
    } else {
        const value = sta.values[stapar];
        if (value == null) {
            const state = missingState.get(input.el) ?? {
                name: sta.name,
                values: {}
            };
            missingState.set(input.el, state);
            state.values[stapar] = "";
            return {
                type: "state",
                el: sta.name,
                value: stapar
            };
        } else if (typeof value === "object") {
            return value;
        } else {
            return {
                type: "state",
                el: sta.name,
                value: value
            };
        }
    }
}
