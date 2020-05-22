import AbstractLiteral from "./AbstractLiteral";
import AbstractOperator from "./AbstractOperator";

export default class OperatorAnd extends AbstractOperator implements AbstractLiteral {

    public constructor() {
        super();
    }

    public toJSON(): JSONLogic  {
        return {
            type: "and",
            el: Array.from(this.children).map(e => e.toJSON())
        };
    }

}