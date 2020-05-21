import AbstractElement from "./AbstractElement";

export default class OperatorNor extends AbstractElement {

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