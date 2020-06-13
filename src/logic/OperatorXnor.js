import AbstractOperator from "./AbstractOperator.js";

export default class OperatorXnor extends AbstractOperator {

    constructor() {
        super();
    }

    toJSON()  {
        return {
            type: "xnor",
            el: this.children.map(e => e.toJSON())
        };
    }

}