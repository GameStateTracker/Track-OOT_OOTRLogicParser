import Translation from "../../utils/Translation.js";

export default function postCalculate(scope, input/* , age = "", region = "", basic = false */) {
    if (input?.value == null) {
        console.warn("nullsy value detected");
        return {
            type: "error",
            ref: "nullsy"
        };
    }
    const res = Translation.getValueName(input.value);
    if (res != null) {
        return {
            type: "string",
            value: res.ref
        };
    }
    return input;
}
