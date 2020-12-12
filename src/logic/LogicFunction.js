import AbstractOperator from "./AbstractOperator.js";

export default class LogicFunction extends AbstractOperator {

    #ref;

    constructor(ref) {
        super();
        this.#ref = ref;
    }

    toJSON()  {
        return {
            type: "function",
            value: this.#ref,
            el: this.children.map(e => e.toJSON())
        };
    }
}
