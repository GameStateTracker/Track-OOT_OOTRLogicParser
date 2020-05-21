import AbstractElement from "./AbstractElement";

export default class LiteralFalse extends AbstractElement {

    public constructor() {
        super();
    }

    public toJSON(): JSONLogic {
        return {
            type: "false"
        };
    }

    public append(el: AbstractElement) {}

}