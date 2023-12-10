import AbstractOperator from "./AbstractOperator.js";

export default class Operator extends AbstractOperator {

    #ref;

    constructor(ref) {
        super();
        this.#ref = ref;
    }

    toJSON()  {
        return {
            type: "function",
            value: this.#ref,
            content: this.children.map((e) => e.toJSON())
        };
    }

}
