
export default function postCalculate(scope, input, age = "", region = "", basic = false) {
    if (age != "") {
        return {
            type: "mixin",
            el: `${input.el}[${age}]`
        };
    }
    return input;
}
