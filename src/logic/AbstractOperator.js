import AbstractLiteral from "./AbstractLiteral.js";

export default class AbstractOperator extends AbstractLiteral {

    #children = [];

    constructor() {
        super();
        if (new.target === AbstractLiteral) {
            throw new TypeError("Cannot construct AbstractOperator instances directly");
        }
    }

    append(el) {
        this.#children.push(el);
    }

    get children() {
        return this.#children.concat();
    }

}
