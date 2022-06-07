import AbstractOperator from "./AbstractOperator.js";

export default class Operator extends AbstractOperator {

    #value;

    constructor(value) {
        super();
        this.#value = value;
    }

    append(el) {
        if (this.children.length < 1) {
            super.append(el);
        }
    }

    toJSON()  {
        return {
            type: "min",
            el: this.children.slice(0, 1).map((e) => e.toJSON())[0],
            value: this.#value
        };
    }

}
