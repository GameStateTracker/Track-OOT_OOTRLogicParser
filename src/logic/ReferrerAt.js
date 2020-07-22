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
            el: this.children.slice(0,1).map(e => e.toJSON())[0]
        };
    }
}