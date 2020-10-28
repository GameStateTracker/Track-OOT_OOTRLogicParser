import AbstractOperator from "./AbstractOperator.js";

export default class MathSub extends AbstractOperator {

    constructor() {
        super();
    }

    toJSON()  {
        return {
            type: "add",
            el: this.children.map(e => e.toJSON())
        };
    }

}