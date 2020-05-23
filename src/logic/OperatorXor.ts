import AbstractElement from "./AbstractLiteral";
import AbstractOperator from "./AbstractOperator";

export default class OperatorXor extends AbstractOperator implements AbstractElement {

    public constructor() {
        super();
    }

    public toJSON(): JSONLogic  {
        return {
            type: "xor",
            el: this.children.map(e => e.toJSON())
        };
    }

}