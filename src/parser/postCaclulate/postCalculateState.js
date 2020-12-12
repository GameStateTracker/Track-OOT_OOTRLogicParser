import Translation from "../../utils/Translation.js";

export default function postCalculate({calc, unstate}, input, age = "", region = "", basic = false) {
    if (input.el == "age" && age != "") {
        if (input.value == age) {
            return {
                type: "true"
            };
        } else {
            return {
                type: "false"
            };
        }
    }
    const stapar = input.value.replace(/^'|'$/g, "");
    const sta = Translation.getStateConfig(input.el);
    if (sta == null) {
        unstate[input.el] = unstate[input.el] || {
            name: "",
            values: {}
        };
        unstate[input.el].values[stapar] = "";
        return {
            type: "state",
            el: input.el,
            value: stapar
        };
    } else {
        return {
            type: "state",
            el: sta.name,
            value: sta.values[stapar]
        };
    }
}
