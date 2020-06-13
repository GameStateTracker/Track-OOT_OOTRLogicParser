import AbstractOperator from "./AbstractOperator.js";

export default class OperatorNot extends AbstractOperator {

    constructor() {
        super();
    }

    toJSON()  {
        return {
            type: "not",
            el: this.children.slice(0,1).map(e => e.toJSON())[0]
        };
    }

}