import AbstractElement from "./AbstractElement";

export default class OperatorOr extends AbstractElement {

    public constructor() {
        super();
    }

    public toJSON(): JSONLogic  {
        return {
            type: "or",
            el: Array.from(this.children).map(e => e.toJSON())
        };
    }
}