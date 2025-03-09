import RandONC from "../utils/RandONCFile.js";
import RandTokenizer from "../utils/RandTokenizer.js";
import LogicBuilder from "../utils/LogicBuilder.js";
import LogicGenerator from "./LogicGenerator.js";

let rules = {};

class HelperParser {

    parse(input, dataNames = []) {
        const helpers = RandONC.parse(input);
        for (const i in helpers) {
            const pos = i.indexOf("(");
            if (pos > 0) {
                // TODO generate function helpers
                const fname = i.slice(0, pos);
                const params = i.slice(pos + 1, -1).split(/\s*,\s*/);
                LogicGenerator.addFunction(fname, transpileFunction(helpers[i], params, dataNames));
            } else {
                LogicGenerator.addMixin(i, transpile(helpers[i], dataNames));
            }
        }
    }

    get() {
        rules = {};
        return rules;
    }

}

function transpileFunction(input, params, dataNames = []) {
    const token = RandTokenizer.tokenize(input);
    const logic = LogicBuilder.build(token, params, dataNames);
    return {
        logic,
        params
    };
}

function transpile(input, dataNames = []) {
    const token = RandTokenizer.tokenize(input);
    const logic = LogicBuilder.build(token, [], dataNames);
    return logic;
}

export default new HelperParser();
