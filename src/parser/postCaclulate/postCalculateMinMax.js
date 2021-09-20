
export default function postCalculate(scope, input, age = "", region = "", basic = false) {
    const {calc} = scope;
    const buffer = parseInt(input.value);
    if (isNaN(buffer)) {
        throw new TypeError("expected integer but value was not a number");
    }
    return {
        type: input.type,
        el: calc(scope, input.el, age, region, basic),
        value: buffer
    };
}
