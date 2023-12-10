import AbstractOperator from "./AbstractOperator.js";

export default class Operator extends AbstractOperator {

    constructor() {
        super();
    }

    append(el) {
        if (this.children.length < 2) {
            super.append(el);
        }
    }

    toJSON()  {
        return {
            type: "eq",
            content: this.children.slice(0, 2).map((e) => e.toJSON())
        };
    }

}
