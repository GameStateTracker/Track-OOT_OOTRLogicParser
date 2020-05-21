import AbstractElement from "./AbstractElement";

export default class OperatorAnd extends AbstractElement {

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