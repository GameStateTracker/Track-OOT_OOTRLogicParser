import AbstractLiteral from "./AbstractLiteral.js";

export default class Literal extends AbstractLiteral {

    toJSON() {
        return {type: "true"};
    }

}
