import AbstractElement from "./AbstractLiteral";
import AbstractOperator from "./AbstractOperator";

export default class OperatorNot extends AbstractOperator implements AbstractElement {

    public constructor() {
        super();
    }

    public toJSON(): JSONLogic  {
        return {
            type: "not",
            el: Array.from(this.children).slice(0,1).map(e => e.toJSON())[0]
        };
    }

}