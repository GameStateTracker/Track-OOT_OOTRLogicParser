import AbstractOperator from "./AbstractOperator.js";

export default class OperatorXnor extends AbstractOperator {

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
            type: "xnor",
            el: this.children.slice(0,2).map(e => e.toJSON())
        };
    }

}