import AbstractOperator from "./AbstractOperator.js";

export default class OperatorXor extends AbstractOperator {

    constructor() {
        super();
    }

    toJSON()  {
        return {
            type: "xor",
            el: this.children.map(e => e.toJSON())
        };
    }

}