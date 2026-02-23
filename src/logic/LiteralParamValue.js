import AbstractLiteral from "./AbstractLiteral.js";

export default class Literal extends AbstractLiteral {

    #ref;

    constructor(ref) {
        super();
        this.#ref = ref;
    }

    get ref() {
        return this.#ref;
    }

    toJSON()  {
        return {
            type: "paramvalue",
            ref: this.#ref
        };
    }

}
