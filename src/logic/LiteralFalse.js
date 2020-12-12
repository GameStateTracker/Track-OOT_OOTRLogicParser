import AbstractLiteral from "./AbstractLiteral.js";

export default class LiteralFalse extends AbstractLiteral {

    toJSON() {
        return {
            type: "false"
        };
    }

}
