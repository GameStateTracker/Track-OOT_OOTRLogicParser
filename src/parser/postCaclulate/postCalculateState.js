import Translation from "../../utils/Translation.js";

export default function postCalculate(scope, input, age = ""/* , region = "", basic = false */) {
    const {missingState} = scope;
    if (input.content == "age" && age != "") {
        if (input.value == age) {
            return {type: "true"};
        } else {
            return {type: "false"};
        }
    }
    const stapar = input.value.replace(/^'|'$/g, "");
    const sta = Translation.getStateConfig(input.content);
    if (sta == null) {
        const state = missingState.get(input.content) ?? {
            name: "",
            values: {}
        };
        missingState.set(input.content, state);
        state.values[stapar] = "";
        return {
            type: "state",
            content: input.content,
            value: stapar
        };
    } else {
        const value = sta.values[stapar];
        if (value == null) {
            const state = missingState.get(input.content) ?? {
                name: sta.name,
                values: {}
            };
            missingState.set(input.content, state);
            state.values[stapar] = "";
            return {
                type: "state",
                content: sta.name,
                value: stapar
            };
        } else if (typeof value === "object") {
            return value;
        } else {
            return {
                type: "state",
                content: sta.name,
                value: value
            };
        }
    }
}
