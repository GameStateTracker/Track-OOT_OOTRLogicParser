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
            const [, value] = current.split("not ");
            const resValue = this.resolveToken(value, token);
            const not = new OperatorNot();
            not.append(resValue);
            return not;
        }
        if (current.indexOf(" == ") >= 0) {
            const [ref, value] = current.split(" == ");
            const resRef = this.#getTokenValue(ref, token);
            const resValue = this.#getTokenValue(value, token);
            const el = new LiteralState(resRef, resValue);
            return el;
        }
        if (current.indexOf(" != ") >= 0) {
            const [ref, value] = current.split(" != ");
            const resRef = this.#getTokenValue(ref, token);
            const resValue = this.#getTokenValue(value, token);
            const not = new OperatorNot();
            const el = new LiteralState(resRef, resValue);
            not.append(el);
            return not;
        }
        if (current.startsWith("min(")) {
            const [ref, value] = current.slice(4, -1).split(", ");
            const resRef = this.resolveToken(ref, token);
            const el = new OperatorMin(parseInt(value) || 0);
            el.append(resRef);
            return el;
        }
        if (current.startsWith("gte(")) {
            const [ref, value] = current.slice(4, -1).split(", ");
            const resRef = this.resolveToken(ref, token);
            const resValue = this.resolveToken(value, token);
            const el = new ComparatorGreaterThanEqual();
            el.append(resRef);
            el.append(resValue);
            return el;
        }
        if (current.startsWith("at(")) {
            const [ref, value] = current.slice(3, -1).split(", ");
            const resRef = this.#getTokenValue(ref, token).replace(/^'(.*)'$/, "$1");
            const resValue = this.resolveToken(value, token);
            const el = new ReferrerAt(resRef);
            el.append(resValue);
            return el;
        }
        if (current.startsWith("here(")) {
            const ref = current.slice(5, -1);
            const resRef = this.resolveToken(ref, token);
            const el = new ReferrerHere();
            el.append(resRef);
            return el;
        }
        if (current.indexOf("(") >= 0) {
            const name = current.slice(0, current.indexOf("("));
            const params = current.slice(current.indexOf("(") + 1, -1).split(", ");
            const el = new LogicFunction(name);
            for (const param of params) {
                const resParam = this.resolveToken(param, token);
                el.append(resParam);
            }
            return el;
        }
        if (isSurroundedBy(current.trim(), "{{", "}}")) {
            const next = this.#getTokenValue(current, token);
            const result = this.resolveToken(next, token);
            return result;
        }
        if (current == "False") {
            return new LiteralFalse();
        }
        if (current == "True") {
            return new LiteralTrue();
        }
        if (current === "shadow_temple_shortcuts") {
            console.log("found it")
        }
        return new LiteralValue(current);
    }

    #getTokenValue(current, token) {
        const value =  token[parseInt(current.slice(2, -2))];
        if (isSurroundedBy(value.trim(), "{{", "}}")) {
            return this.#getTokenValue(value, token);
        }
        return value;
    }

}

function isSurroundedBy(value, start, end) {
    return value.startsWith(start) && value.endsWith(end);
}

export default new LogicBuilder();
