import AbstractOperator from "./AbstractOperator.js";

export default class Operator extends AbstractOperator {

    constructor() {
        super();
    }

    toJSON()  {
        return {
            type: "mod",
            el: this.children.map(e => e.toJSON())
        };
    }

}
