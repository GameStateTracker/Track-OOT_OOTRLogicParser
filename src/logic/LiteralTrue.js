import AbstractLiteral from "./AbstractLiteral.js";

export default class LiteralTrue extends AbstractLiteral {

    toJSON() {
        return {
            type: "true"
        };
    }

}