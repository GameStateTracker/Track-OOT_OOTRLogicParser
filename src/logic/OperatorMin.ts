import AbstractElement from "./AbstractElement";

export default class OperatorNot extends AbstractElement {

    private value: number;

    public constructor(value: number) {
        super();
        this.value = value;
    }

    public toJSON(): JSONLogic  {
        return {
            type: "min",
            el: Array.from(this.children).slice(0,1).map(e => e.toJSON())[0],
            value: this.value
        };
    }
}