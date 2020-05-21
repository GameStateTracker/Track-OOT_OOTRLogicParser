import AbstractElement from "./AbstractElement";

export default class OperatorNand extends AbstractElement {

    public constructor() {
        super();
    }

    public toJSON(): JSONLogic  {
        return {
            type: "nand",
            el: Array.from(this.children).map(e => e.toJSON())
        };
    }
}