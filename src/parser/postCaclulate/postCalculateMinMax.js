
export default function postCalculate(scope, input, region = "", basic = false) {
    const {
        calc
    } = scope;
    const buffer = parseInt(input.value);
    if (isNaN(buffer)) {
        throw new TypeError("expected integer but value was not a number");
    }
    return {
        type: input.type,
        content: calc(scope, input.content, region, basic),
        value: buffer
    };
}
