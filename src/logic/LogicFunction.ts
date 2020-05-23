import AbstractLiteral from "./AbstractLiteral";
import AbstractOperator from "./AbstractOperator";

export default class LogicFunction extends AbstractOperator implements AbstractLiteral {

    private ref: string;

    public constructor(ref: string) {
        super();
        this.ref = ref;
    }

    public toJSON(): JSONLogic  {
        return {
            type: "function",
            value: this.ref,
            el: this.children.map(e => e.toJSON())
        };
    }
}