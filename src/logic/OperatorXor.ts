import AbstractElement from "./AbstractElement";

export default class OperatorXor extends AbstractElement {

    public constructor() {
        super();
    }

    public toJSON(): JSONLogic  {
        return {
            type: "xor",
            el: Array.from(this.children).slice(0,2).map(e => e.toJSON())
        };
    }
}