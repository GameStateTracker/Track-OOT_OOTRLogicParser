import LiteralFalse from "../logic/LiteralFalse.js";
import LiteralTrue from "../logic/LiteralTrue.js";
import LiteralValue from "../logic/LiteralValue.js";
import LiteralState from "../logic/LiteralState.js";
import LiteralPointer from "../logic/LiteralPointer.js";
import OperatorAnd from "../logic/OperatorAnd.js";
import OperatorNand from "../logic/OperatorNand.js";
import OperatorOr from "../logic/OperatorOr.js";
import OperatorNor from "../logic/OperatorNor.js";
import OperatorXor from "../logic/OperatorXor.js";
import OperatorXnor from "../logic/OperatorXnor.js";
import OperatorNot from "../logic/OperatorNot.js";
import OperatorMin from "../logic/OperatorMin.js";
import OperatorMax from "../logic/OperatorMax.js";
import ReferrerAt from "../logic/ReferrerAt.js";
import ReferrerHere from "../logic/ReferrerHere.js";
import LogicFunction from "../logic/LogicFunction.js";

class LogicBuilder {

    build(token) {
        let root = token[0];
        let result = this.resolveToken(root, token);
        return result.toJSON();
    }

    resolveToken(current, token) {
        if (current.indexOf(" and ") >= 0) {
            let children = current.split(" and ");
            let el = new OperatorAnd();
            for (let ch of children) {
                el.append(this.resolveToken(ch, token));
            }
            return el;
        }
        if (current.indexOf(" or ") >= 0) {
            let children = current.split(" or ");
            let el = new OperatorOr();
            for (let ch of children) {
                el.append(this.resolveToken(ch, token));
            }
            return el;
        }
        if (current.indexOf(" == ") >= 0) {
            let [ref, value] = current.split(" == ");
            ref = token[parseInt(ref.slice(1, -1))];
            value = token[parseInt(value.slice(1, -1))];
            let el = new LiteralState(ref, value);
            return el;
        }
        if (current.indexOf(" != ") >= 0) {
            let [ref, value] = current.split(" != ");
            ref = token[parseInt(ref.slice(1, -1))];
            value = token[parseInt(value.slice(1, -1))];
            let not = new OperatorNot();
            let el = new LiteralState(ref, value);
            not.append(el);
            return not;
        }
        if (current.startsWith("min(")) {
            let [ch, value] = current.slice(4, -1).split(", ");
            let el = new OperatorMin(parseInt(value) || 0);
            el.append(this.resolveToken(ch, token));
            return el;
        }
        if (current.startsWith("at(")) {
            let [value, ch] = current.slice(3, -1).split(", ");
            value = token[parseInt(value.slice(1, -1))].replace(/^'(.*)'$/, "$1")
            let el = new ReferrerAt(value);
            el.append(this.resolveToken(ch, token));
            return el;
        }
        if (current.startsWith("here(")) {
            let ch = current.slice(5, -1);
            let el = new ReferrerHere();
            el.append(this.resolveToken(ch, token));
            return el;
        }
        if (current.indexOf("(") >= 0) {
            let name = current.slice(0, current.indexOf("("));
            let params = current.slice(current.indexOf("(") + 1, -1).split(", ");
            let el = new LogicFunction(name);
            for (let ch of params) {
                el.append(this.resolveToken(ch, token));
            }
            return el;
        }
        if (current.startsWith("%") && current.endsWith("%")) {
            let next = token[parseInt(current.slice(1, -1))];
            return this.resolveToken(next, token);
        }
        if (current == 'False') {
            return new LiteralFalse();
        }
        if (current == 'True') {
            return new LiteralTrue();
        }


        // TODO implement this
        // XXX this is just demo code
        return new LiteralValue(current);
    }

}

export default new LogicBuilder();