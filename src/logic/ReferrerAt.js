import AbstractOperator from "./AbstractOperator.js";

export default class Operator extends AbstractOperator {

    #node;

    constructor(node) {
        super();
        this.#node = node;
    }

    append(el) {
        if (this.children.length < 1) {
            super.append(el);
        }
    }

    toJSON()  {
        return {
            type: "at",
            node: this.#node,
            el: this.children.slice(0, 1).map(e => e.toJSON())[0]
        };
    }

}
