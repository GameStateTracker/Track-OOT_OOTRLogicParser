import LiteralFalse from "../logic/LiteralFalse.js";
import LiteralTrue from "../logic/LiteralTrue.js";
import LiteralValue from "../logic/LiteralValue.js";
import LiteralState from "../logic/LiteralState.js";
import OperatorAnd from "../logic/OperatorAnd.js";
import OperatorOr from "../logic/OperatorOr.js";
import OperatorNot from "../logic/OperatorNot.js";
import OperatorMin from "../logic/OperatorMin.js";
import ComparatorGreaterThanEqual from "../logic/ComparatorGreaterThanEqual.js";
import ReferrerAt from "../logic/ReferrerAt.js";
import ReferrerHere from "../logic/ReferrerHere.js";
import LogicFunction from "../logic/LogicFunction.js";

class LogicBuilder {

    build(token) {
        const root = token[0];
        const result = this.resolveToken(root, token);
        return result.toJSON();
    }

    resolveToken(current, token) {
        if (current.indexOf(" and ") >= 0) {
            const children = current.split(" and ");
            const el = new OperatorAnd();
            for (const ch of children) {
                el.append(this.resolveToken(ch, token));
            }
            return el;
        }
        if (current.indexOf(" or ") >= 0) {
            const children = current.split(" or ");
            const el = new OperatorOr();
            for (const ch of children) {
                el.append(this.resolveToken(ch, token));
            }
            return el;
        }
        if (current.indexOf("not ") >= 0) {
            let [, value] = current.split("not ");
            value = this.resolveToken(value, token);
            const not = new OperatorNot();
            not.append(value);
            return not;
        }
        if (current.indexOf(" == ") >= 0) {
            let [ref, value] = current.split(" == ");
            ref = token[parseInt(ref.slice(2, -2))];
            value = token[parseInt(value.slice(2, -2))];
            const el = new LiteralState(ref, value);
            return el;
        }
        if (current.indexOf(" != ") >= 0) {
            let [ref, value] = current.split(" != ");
            ref = token[parseInt(ref.slice(2, -2))];
            value = token[parseInt(value.slice(2, -2))];
            const not = new OperatorNot();
            const el = new LiteralState(ref, value);
            not.append(el);
            return not;
        }
        if (current.startsWith("min(")) {
            const [ch, value] = current.slice(4, -1).split(", ");
            const el = new OperatorMin(parseInt(value) || 0);
            el.append(this.resolveToken(ch, token));
            return el;
        }
        if (current.startsWith("gte(")) {
            const [ch, value] = current.slice(4, -1).split(", ");
            const el = new ComparatorGreaterThanEqual();
            el.append(this.resolveToken(ch, token));
            el.append(this.resolveToken(value, token));
            return el;
        }
        if (current.startsWith("at(")) {
            const [value, ch] = current.slice(3, -1).split(", ");
            const newValue = token[parseInt(value.slice(2, -2))].replace(/^'(.*)'$/, "$1");
            const el = new ReferrerAt(newValue);
            el.append(this.resolveToken(ch, token));
            return el;
        }
        if (current.startsWith("here(")) {
            const ch = current.slice(5, -1);
            const el = new ReferrerHere();
            el.append(this.resolveToken(ch, token));
            return el;
        }
        if (current.indexOf("(") >= 0) {
            const name = current.slice(0, current.indexOf("("));
            const params = current.slice(current.indexOf("(") + 1, -1).split(", ");
            const el = new LogicFunction(name);
            for (const ch of params) {
                el.append(this.resolveToken(ch, token));
            }
            return el;
        }
        if (current.startsWith("{{") && current.endsWith("}}")) {
            const next = token[parseInt(current.slice(2, -2))];
            return this.resolveToken(next, token);
        }
        if (current.startsWith(" {{") && current.endsWith("}}")) {
            const next = token[parseInt(current.slice(3, -2))];
            return this.resolveToken(next, token);
        }
        if (current == "False") {
            return new LiteralFalse();
        }
        if (current == "True") {
            return new LiteralTrue();
        }
        return new LiteralValue(current);
    }

}

export default new LogicBuilder();
