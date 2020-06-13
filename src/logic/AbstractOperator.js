import AbstractLiteral from "./AbstractLiteral.js";

export default class AbstractOperator extends AbstractLiteral {

    #children = [];

    append(el) {
        this.#children.push(el);
    }

    get children() {
        return this.#children.concat();
    }

}