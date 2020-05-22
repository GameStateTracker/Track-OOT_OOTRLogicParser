import AbstractLiteral from "./AbstractLiteral";

export default abstract class AbstractOperator {

    protected children: AbstractLiteral[] = [];

    public append(el: AbstractLiteral): void {
        this.children.push(el);
    }

}