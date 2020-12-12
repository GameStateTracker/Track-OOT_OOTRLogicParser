
export default function postCalculate({calc}, input, age = "", region = "", basic = false) {
    const buffer = parseInt(input.value);
    if (isNaN(buffer)) {
        return {
            type: input.type == "min" ? "lte" : "gte",
            el: calc(input.el, age, region, basic),
            value: input.value.replace(/^'|'$/g, "")
        };
    }
    return {
        type: input.type,
        el: calc(input.el, age, region, basic),
        value: buffer
    };
}
