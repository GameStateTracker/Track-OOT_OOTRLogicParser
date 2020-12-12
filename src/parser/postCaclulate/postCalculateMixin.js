
export default function postCalculate({calc}, input, age = "", region = "", basic = false) {
    if (age != "") {
        return {
            type: "mixin",
            el: `${input.el}[${age}]`
        };
    }
    return input;
}
