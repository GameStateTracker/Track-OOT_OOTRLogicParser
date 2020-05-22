import AbstractLiteral from "./AbstractLiteral";

export default class LiteralPointer implements AbstractLiteral {

    private ref: string;
    private category: string | undefined;

    public constructor(ref: string, category?: string) {
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
}