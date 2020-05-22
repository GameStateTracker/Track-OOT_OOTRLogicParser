import AbstractLiteral from "./AbstractLiteral";

export default class LiteralTrue implements AbstractLiteral {

    public toJSON(): JSONLogic {
        return {
            type: "true"
        };
    }

}