import AbstractOperator from "./AbstractOperator.js";

export default class MathSub extends AbstractOperator {

    constructor() {
        super();
    }

    toJSON()  {
        return {
            type: "sub",
            el: this.children.map(e => e.toJSON())
        };
    }

}
