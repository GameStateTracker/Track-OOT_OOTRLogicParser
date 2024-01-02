
export default function postCalculate(scope, input, age = ""/* , region = "", basic = false */) {
    if (age != "") {
        return {
            type: "mixin",
            ref: `${input.ref}{${age}}`
        };
    }
    return input;
}
