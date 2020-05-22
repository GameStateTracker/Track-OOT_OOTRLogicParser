import AbstractLiteral from "./AbstractLiteral";

export default class LiteralValue implements AbstractLiteral {

    private ref: string;
    private category: string | undefined;

    public constructor(ref: string, category?: string) {
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
}