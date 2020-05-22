import AbstractElement from "./AbstractElement";

export default class LiteralValue extends AbstractElement {

    private ref: string;
    private category: string | undefined;

    public constructor(ref: string, category?: string) {
        super();
        this.ref = ref;
        this.category = category;
    }

    public toJSON(): JSONLogic  {
        if (!!this.category) {
            return {
                type: "value",
                el: this.ref,
                category: this.category
            };
        } else {
            return {
                type: "value",
                el: this.ref
            };
        }
    }

    public append(el: AbstractElement) {}
}