import AbstractElement from "../logic/AbstractLiteral";
import LiteralFalse from "../logic/LiteralFalse";
import LiteralTrue from "../logic/LiteralTrue";
import LiteralValue from "../logic/LiteralValue";
import LiteralState from "../logic/LiteralState";
import OperatorAnd from "../logic/OperatorAnd";
import OperatorNand from "../logic/OperatorNand";
import OperatorOr from "../logic/OperatorOr";
import OperatorNor from "../logic/OperatorNor";
import OperatorXor from "../logic/OperatorXor";
import OperatorXnor from "../logic/OperatorXnor";
import OperatorNot from "../logic/OperatorNot";
import OperatorMin from "../logic/OperatorMin";
import OperatorMax from "../logic/OperatorMax";

import LogicFunction from "../logic/LogicFunction";

export default abstract class LogicBuilder {

    public static build(token: string[]): JSONLogic {
        let root = token[0];
        let result = LogicBuilder.resolveToken(root, token);
        return result.toJSON();
    }

    private static resolveToken(current: string, token: string[]): AbstractElement {
        if (current.indexOf(" and ") >= 0) {
            let children = current.split(" and ");
            let el = new OperatorAnd();
            for (let ch of children) {
                el.append(LogicBuilder.resolveToken(ch, token));
            }
            return el;
        }
        if (current.indexOf(" or ") >= 0) {
            let children = current.split(" or ");
            let el = new OperatorOr();
            for (let ch of children) {
                el.append(LogicBuilder.resolveToken(ch, token));
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
            el.append(LogicBuilder.resolveToken(ch, token));
            return el;
        }
        if (current.indexOf("(") >= 0) {
            let name = current.slice(0, current.indexOf("("));
            let params = current.slice(current.indexOf("(") + 1, -1).split(", ");
            let el = new LogicFunction(name);
            for (let ch of params) {
                el.append(LogicBuilder.resolveToken(ch, token));
            }
            return el;
        }
        if (current.startsWith("%") && current.endsWith("%")) {
            let next = token[parseInt(current.slice(1, -1))];
            return LogicBuilder.resolveToken(next, token);
        }


        // TODO implement this
        // XXX this is just demo code
        return new LiteralValue(current);
    }

}