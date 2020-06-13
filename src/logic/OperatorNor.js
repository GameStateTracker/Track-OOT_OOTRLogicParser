import AbstractOperator from "./AbstractOperator.js";

export default class OperatorNor extends AbstractOperator {

    constructor() {
        super();
    }

    toJSON()  {
        return {
            type: "nor",
            el: this.children.map(e => e.toJSON())
        };
    }

}