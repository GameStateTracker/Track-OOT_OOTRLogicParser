import AbstractOperator from "./AbstractOperator.js";

export default class MathDiv extends AbstractOperator {

    constructor() {
        super();
    }

    toJSON()  {
        return {
            type: "div",
            el: this.children.map(e => e.toJSON())
        };
    }

}