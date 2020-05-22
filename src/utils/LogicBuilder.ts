import AbstractElement from "../logic/AbstractLiteral";
import LiteralFalse from "../logic/LiteralFalse";
import LiteralTrue from "../logic/LiteralTrue";
import LiteralValue from "../logic/LiteralValue";
import LiteralState from "../logic/LiteralState";
import OperatorAnd from "../logic/OperatorAnd";
import OperatorOr from "../logic/OperatorOr";
import OperatorNot from "../logic/OperatorNot";
import OperatorMin from "../logic/OperatorMin";



export default abstract class LogicBuilder {

    public static build(token: string[]): JSONLogic {
        let root = token[0];
        let result = LogicBuilder.resolveToken(root, token);
        return result.toJSON();
    }

    private static resolveToken(current: string, token: string[]): AbstractElement {
        if (current.startsWith("min(")) {
            let [ch, value] = current.slice(4, -1).split(", ");
            let el = new OperatorMin(parseInt(value) || 0);
            if (ch.startsWith("%")) {
                let next = token[parseInt(ch.slice(1, -1))];
                el.append(LogicBuilder.resolveToken(next, token));
            } else {
                el.append(LogicBuilder.resolveToken(ch, token));
            }
            return el;
        }
        if (current.indexOf(" and ") >= 0) {
            let children = current.split(" and ");
            let el = new OperatorAnd();
            for (let ch of children) {
                if (ch.startsWith("%")) {
                    let next = token[parseInt(ch.slice(1, -1))];
                    el.append(LogicBuilder.resolveToken(next, token));
                } else {
                    el.append(LogicBuilder.resolveToken(ch, token));
                }
            }
            return el;
        }
        if (current.indexOf(" or ") >= 0) {
            let children = current.split(" or ");
            let el = new OperatorOr();
            for (let ch of children) {
                if (ch.startsWith("%")) {
                    let next = token[parseInt(ch.slice(1, -1))];
                    el.append(LogicBuilder.resolveToken(next, token));
                } else {
                    el.append(LogicBuilder.resolveToken(ch, token));
                }
            }
            return el;
        }


        // TODO implement this
        // XXX this is just demo code
        return new LiteralValue(current);
    }

}