
export default function postCalculate(scope, input, age = ""/* , region = "", basic = false */) {
    if (age != "") {
        return {
            type: "mixin",
            content: `${input.content}{${age}}`
        };
    }
    return input;
}
