import AbstractLiteral from "./AbstractLiteral.js";

export default class Literal extends AbstractLiteral {

    #ref;

    #category;

    constructor(ref, category) {
        super();
        this.#ref = ref;
        this.#category = category;
    }

    toJSON()  {
        if (this.#category != null) {
            return {
                type: "pointer",
                content: this.#ref,
                category: this.#category
            };
        } else {
            return {
                type: "pointer",
                content: this.#ref
            };
        }
    }

}
