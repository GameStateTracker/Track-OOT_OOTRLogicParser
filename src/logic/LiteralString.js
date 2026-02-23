import AbstractLiteral from "./AbstractLiteral.js";

export default class Literal extends AbstractLiteral {

    #value;

    constructor(value) {
        super();
        this.#value = value;
    }

    toJSON()  {
        return {
            type: "string",
            value: this.#value
        };
    }

}
