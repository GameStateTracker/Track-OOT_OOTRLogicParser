import RandONC from "../utils/RandONCFile.js";
import RandTokenizer from "../utils/RandTokenizer.js";
import LogicBuilder from "../utils/LogicBuilder.js";
import LogicGenerator from "./LogicGenerator.js";

let rules = {};

class HelperParser {

    parse(input) {
        let helpers = RandONC.parse(input);
        for (let i in helpers) {
            let pos = i.indexOf("(");
            if (pos > 0) {
                // TODO generate function helpers
                // functions need to geenerate a "mixin" for each different parameters they are called with
                let fname = i.slice(0, pos);
                let params = i.slice(pos + 1, -1).split(", ");
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
    //console.log(input);
    let token = RandTokenizer.tokenize(input);
    //console.log(token);
    let logic = LogicBuilder.build(token);
    //console.log(logic);
    //console.log("----------------------------");
    return {
        params,
        logic
    };
}

function transpile(input) {
    let token = RandTokenizer.tokenize(input);
    let logic = LogicBuilder.build(token);
    return logic;
}

export default new HelperParser();