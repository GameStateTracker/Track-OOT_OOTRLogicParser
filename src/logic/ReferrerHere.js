import AbstractOperator from "./AbstractOperator.js";

export default class LogicHere extends AbstractOperator {

    constructor() {
        super();
    }

    toJSON()  {
        return {
            type: "here",
            el: this.children.map(e => e.toJSON())
        };
    }
}