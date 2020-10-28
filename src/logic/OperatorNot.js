import AbstractOperator from "./AbstractOperator.js";

export default class OperatorNot extends AbstractOperator {

    constructor() {
        super();
    }

    append(el) {
        if (this.children.length < 1) {
            super.append(el);
        }
    }

    toJSON()  {
        return {
            type: "not",
			el: this.children.slice(0,1).map(e => e.toJSON())[0]
        };
    }

}