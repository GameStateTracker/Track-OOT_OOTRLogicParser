import RandONC from "../utils/RandONCFile.js";
import RandTokenizer from "../utils/RandTokenizer.js";
import LogicBuilder from "../utils/LogicBuilder.js";
import LogicGenerator from "./LogicGenerator.js";

let rules = {};

class HelperParser {

    parse(input) {
        const helpers = RandONC.parse(input);
        for (const i in helpers) {
            const pos = i.indexOf("(");
            if (pos > 0) {
                const fname = i.slice(0, pos);
                const params = i.slice(pos + 1, -1).split(", ");
                LogicGenerator.addFunction(fname, transpileFunction(helpers[i], params));
            } else {
                LogicGenerator.addMixin(i, transpile(helpers[i]));
            }
        }
    }

    get() {
        rules = {};
        return rules;
    }

}

function transpileFunction(input, params) {
    const token = RandTokenizer.tokenize(input);
    const logic = LogicBuilder.build(token, params);
    return {
        params,
        logic
    };
}

function transpile(input) {
    const token = RandTokenizer.tokenize(input);
    const logic = LogicBuilder.build(token);
    return logic;
}

export default new HelperParser();
