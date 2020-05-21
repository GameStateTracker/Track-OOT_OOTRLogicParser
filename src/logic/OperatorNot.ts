import AbstractElement from "./AbstractElement";

export default class OperatorNot extends AbstractElement {

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