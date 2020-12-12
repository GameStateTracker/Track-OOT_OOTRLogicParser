import AbstractOperator from "./AbstractOperator.js";

export default class OperatorNand extends AbstractOperator {

    constructor() {
        super();
    }

    toJSON()  {
        return {
            type: "nand",
            el: this.children.map(e => e.toJSON())
        };
    }

}
