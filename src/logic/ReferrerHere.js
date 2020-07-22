import AbstractOperator from "./AbstractOperator.js";

export default class LogicHere extends AbstractOperator {

    constructor() {
        super();
    }

    toJSON()  {
        return {
            type: "here",
            el: this.children.slice(0,1).map(e => e.toJSON())[0]
        };
    }
}