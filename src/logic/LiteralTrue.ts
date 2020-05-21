import AbstractElement from "./AbstractElement";

export default class LiteralTrue extends AbstractElement {

    public constructor() {
        super();
    }

    public toJSON(): JSONLogic {
        return {
            type: "true"
        };
    }

    public append(el: AbstractElement) {}

}