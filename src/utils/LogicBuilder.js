import LiteralFalse from "../logic/LiteralFalse.js";
import LiteralTrue from "../logic/LiteralTrue.js";
import LiteralValue from "../logic/LiteralValue.js";
import LiteralParam from "../logic/LiteralParam.js";
import LiteralData from "../logic/LiteralData.js";
import LiteralState from "../logic/LiteralState.js";
import OperatorAnd from "../logic/OperatorAnd.js";
import OperatorOr from "../logic/OperatorOr.js";
import OperatorNot from "../logic/OperatorNot.js";
import OperatorMin from "../logic/OperatorMin.js";
import ComparatorEqual from "../logic/ComparatorEqual.js";
import ComparatorNotEqual from "../logic/ComparatorNotEqual.js";
import ComparatorLessThan from "../logic/ComparatorLessThan.js";
import ComparatorGreaterThanEqual from "../logic/ComparatorGreaterThanEqual.js";
import ReferrerAt from "../logic/ReferrerAt.js";
import ReferrerHere from "../logic/ReferrerHere.js";
import LogicFunction from "../logic/LogicFunction.js";

const REF_REGEX = /^\{\{[0-9]+\}\}$/;

class LogicBuilder {

    build(token, params = [], dataNames = []) {
        const root = token[0];
        const result = this.resolveToken(root, token, params, dataNames);
        return result.toJSON();
    }

    resolveToken(current, token, params = [], dataNames = []) {
        if (params != null && params.includes(current)) {
            return new LiteralParam(current);
        }
        if (dataNames != null && dataNames.includes(current)) {
            return new LiteralData(current);
        }
        if (current.indexOf(" and ") >= 0) {
            const children = current.split(" and ");
            const el = new OperatorAnd();
            for (const ch of children) {
                el.append(this.resolveToken(ch, token, params, dataNames));
            }
            return el;
        }
        if (current.indexOf(" or ") >= 0) {
            const children = current.split(" or ");
            const el = new OperatorOr();
            for (const ch of children) {
                el.append(this.resolveToken(ch, token, params, dataNames));
            }
            return el;
        }
        if (current.indexOf("not ") >= 0) {
            const [, value] = current.split("not ");
            const resValue = this.resolveToken(value, token, params, dataNames);
            const not = new OperatorNot();
            not.append(resValue);
            return not;
        }
        if (current.indexOf(" == ") >= 0) {
            const [ref, value] = current.split(" == ");
            const resRef = this.#getTokenValue(ref, token);
            const resValue = this.#getTokenValue(value, token);
            if (params != null && params.includes(resRef)) {
                const eq = new ComparatorEqual();
                const param = new LiteralParam(resRef);
                const value = this.resolveToken(resValue, token, params, dataNames);
                eq.append(param);
                eq.append(value);
                return eq;
            }
            if (dataNames != null && dataNames.includes(resRef)) {
                const eq = new ComparatorEqual();
                const data = new LiteralData(resRef);
                const value = this.resolveToken(resValue, token, params, dataNames);
                eq.append(data);
                eq.append(value);
                return eq;
            }
            const el = new LiteralState(resRef, resValue);
            return el;
        }
        if (current.indexOf(" != ") >= 0) {
            const [ref, value] = current.split(" != ");
            const resRef = this.#getTokenValue(ref, token);
            const resValue = this.#getTokenValue(value, token);
            if (params != null && params.includes(resRef)) {
                const neq = new ComparatorNotEqual();
                const param = new LiteralParam(resRef);
                const value = this.resolveToken(resValue, token, params, dataNames);
                neq.append(param);
                neq.append(value);
                return neq;
            }
            if (dataNames != null && dataNames.includes(resRef)) {
                const neq = new ComparatorNotEqual();
                const data = new LiteralData(resRef);
                const value = this.resolveToken(resValue, token, params, dataNames);
                neq.append(data);
                neq.append(value);
                return neq;
            }
            const not = new OperatorNot();
            const el = new LiteralState(resRef, resValue);
            not.append(el);
            return not;
        }
        if (current.indexOf(" < ") >= 0) {
            const [ref, value] = current.split(" < ");
            const resRef = this.#getTokenValue(ref, token);
            const resValue = this.#getTokenValue(value, token);
            const el = new ComparatorLessThan(resRef, resValue);
            return el;
        }
        if (current.startsWith("min(")) {
            const [ref, value] = current.slice(4, -1).split(", ");
            const resRef = this.resolveToken(ref, token, params, dataNames);
            const el = new OperatorMin(parseInt(value) || 0);
            el.append(resRef);
            return el;
        }
        if (current.startsWith("gte(")) {
            const [ref, value] = current.slice(4, -1).split(", ");
            const resRef = this.resolveToken(ref, token, params);
            const resValue = this.resolveToken(value, token, params, dataNames);
            const el = new ComparatorGreaterThanEqual();
            el.append(resRef);
            el.append(resValue);
            return el;
        }
        if (current.startsWith("at(")) {
            const [ref, value] = current.slice(3, -1).split(", ");
            const resRef = this.#getTokenValue(ref, token).replace(/^'(.*)'$/, "$1");
            const resValue = this.resolveToken(value, token, params, dataNames);
            const el = new ReferrerAt(resRef);
            el.append(resValue);
            return el;
        }
        if (current.startsWith("here(")) {
            const ref = current.slice(5, -1);
            const resRef = this.resolveToken(ref, token, params, dataNames);
            const el = new ReferrerHere();
            el.append(resRef);
            return el;
        }
        if (current.indexOf("(") >= 0) {
            const name = current.slice(0, current.indexOf("("));
            const callParams = current.slice(current.indexOf("(") + 1, -1).split(", ");
            const el = new LogicFunction(name);
            for (const param of callParams) {
                const resParam = this.resolveToken(param, token, params, dataNames);
                el.append(resParam);
            }
            return el;
        }
        if (REF_REGEX.test(current.trim())) {
            const next = this.#getTokenValue(current, token);
            const result = this.resolveToken(next, token, params, dataNames);
            return result;
        }
        if (current == "False") {
            return new LiteralFalse();
        }
        if (current == "True") {
            return new LiteralTrue();
        }
        return new LiteralValue(current);
    }

    #getTokenValue(current, token) {
        current = current.trim();
        if (REF_REGEX.test(current)) {
            const value = token[parseInt(current.slice(2, -2))];
            return this.#getTokenValue(value, token);
        }
        return current;
    }

}

export default new LogicBuilder();
