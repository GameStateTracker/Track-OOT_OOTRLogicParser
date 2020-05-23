import AbstractElement from "./AbstractLiteral";
import AbstractOperator from "./AbstractOperator";

export default class OperatorXnor extends AbstractOperator implements AbstractElement {

    public constructor() {
        super();
    }

    public toJSON(): JSONLogic  {
        return {
            type: "xnor",
            el: this.children.map(e => e.toJSON())
        };
    }

}