import AbstractLiteral from "./AbstractLiteral";

export default class LiteralFalse implements AbstractLiteral {

    public toJSON(): JSONLogic {
        return {
            type: "false"
        };
    }

}