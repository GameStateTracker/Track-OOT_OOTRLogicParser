
export default class AbstractElement {

    protected children: AbstractElement[] = [];

    protected constructor() { }

    public toJSON(): JSONLogic {
        throw new TypeError("can not call abstract method");
    }

    public append(el: AbstractElement) {
        if (Array.isArray(el)) {
            el.forEach(e => this.children.push(e));
        } else {
            this.children.push(el);
        }
    }

}