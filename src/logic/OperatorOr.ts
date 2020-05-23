import AbstractElement from "./AbstractLiteral";
import AbstractOperator from "./AbstractOperator";

export default class OperatorOr extends AbstractOperator implements AbstractElement {

    public constructor() {
        super();
    }

    public toJSON(): JSONLogic  {
        return {
            type: "or",
            el: this.children.map(e => e.toJSON())
        };
    }

}