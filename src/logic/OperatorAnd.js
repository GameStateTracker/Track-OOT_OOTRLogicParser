import AbstractOperator from "./AbstractOperator.js";

export default class OperatorAnd extends AbstractOperator {

    constructor() {
        super();
    }

    toJSON()  {
        return {
            type: "and",
            el: this.children.map(e => e.toJSON())
        };
    }

}
