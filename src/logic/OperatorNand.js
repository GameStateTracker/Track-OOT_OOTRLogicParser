import AbstractOperator from "./AbstractOperator.js";

export default class Operator extends AbstractOperator {

    constructor() {
        super();
    }

    toJSON()  {
        return {
            type: "nand",
            content: this.children.map((e) => e.toJSON())
        };
    }

}
