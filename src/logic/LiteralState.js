import AbstractLiteral from "./AbstractLiteral.js";

export default class Literal extends AbstractLiteral {

    #ref;
    #value;
    #category;

    constructor(ref, value, category) {
        super();
        this.#ref = ref;
        this.#value = value;
        this.#category = category;
    }

    toJSON()  {
        if (this.#category != null) {
            return {
                type: "state",
                el: this.#ref,
                value: this.#value,
                category: this.#category
            };
        } else {
            return {
                type: "state",
                el: this.#ref,
                value: this.#value
            };
        }
    }
}
