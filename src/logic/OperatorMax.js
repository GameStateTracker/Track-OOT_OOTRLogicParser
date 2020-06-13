import AbstractOperator from "./AbstractOperator.js";

export default class OperatorMax extends AbstractOperator {

    #value;

    constructor(value) {
        super();
        this.#value = value;
    }

    toJSON()  {
        return {
            type: "max",
            el: this.children.slice(0,1).map(e => e.toJSON())[0],
            value: this.#value
        };
    }
}