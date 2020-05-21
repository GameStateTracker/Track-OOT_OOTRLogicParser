import AbstractElement from "./AbstractElement";

export default class LiteralState extends AbstractElement {

    private ref: string;
    private value: string;
    private category: string | undefined;

    public constructor(ref: string, value: string, category: string | undefined) {
        super();
        this.ref = ref;
        this.value = value;
        this.category = category;
    }

    public toJSON(): JSONLogic  {
        if (!!this.category) {
            return {
                type: "state",
                el: this.ref,
                value: this.value,
                category: this.category
            };
        } else {
            return {
                type: "state",
                el: this.ref,
                value: this.value
            };
        }
    }

    public append(el: AbstractElement) {}
}