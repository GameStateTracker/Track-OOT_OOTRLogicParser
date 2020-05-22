import AbstractElement from "./AbstractLiteral";
import AbstractOperator from "./AbstractOperator";

export default class OperatorNot extends AbstractOperator implements AbstractElement {

    private value: number;

    public constructor(value: number) {
        super();
        this.value = value;
    }

    public toJSON(): JSONLogic  {
        return {
            type: "max",
            el: Array.from(this.children).slice(0,1).map(e => e.toJSON())[0],
            value: this.value
        };
    }
}