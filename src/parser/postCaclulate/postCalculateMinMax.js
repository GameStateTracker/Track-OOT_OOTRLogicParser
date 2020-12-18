
export default function postCalculate(scope, input, age = "", region = "", basic = false) {
    const {calc} = scope;
    const buffer = parseInt(input.value);
    if (isNaN(buffer)) {
        return {
            type: input.type == "min" ? "lte" : "gte",
            el: calc(scope, input.el, age, region, basic),
            value: input.value.replace(/^'|'$/g, "")
        };
    }
    return {
        type: input.type,
        el: calc(scope, input.el, age, region, basic),
        value: buffer
    };
}
