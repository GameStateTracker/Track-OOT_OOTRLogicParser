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
            ref: this.#ref,
            params: this.children.map((e) => e.toJSON())
        };
    }

}
