import AbstractOperator from "./AbstractOperator.js";

export default class LogicAt extends AbstractOperator {

    #node;

    constructor(node) {
        super();
        this.#node = node;
    }

    toJSON()  {
        return {
            type: "at",
            node: this.#node,
            el: this.children.map(e => e.toJSON())
        };
    }
}