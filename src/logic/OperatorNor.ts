import AbstractElement from "./AbstractLiteral";
import AbstractOperator from "./AbstractOperator";

export default class OperatorNor extends AbstractOperator implements AbstractElement {

    public constructor() {
        super();
    }

    public toJSON(): JSONLogic  {
        return {
            type: "nor",
            el: Array.from(this.children).map(e => e.toJSON())
        };
    }

}