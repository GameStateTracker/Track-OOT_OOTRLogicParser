import AbstractElement from "./AbstractElement";

export default class LiteralPointer extends AbstractElement {

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
                type: "pointer",
                el: this.ref,
                category: this.category
            };
        } else {
            return {
                type: "pointer",
                el: this.ref
            };
        }
    }

    public append(el: AbstractElement) {}
}