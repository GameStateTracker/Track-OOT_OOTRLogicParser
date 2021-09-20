export default class AbstractLiteral {

    constructor() {
        if (new.target === AbstractLiteral) {
            throw new TypeError("Cannot construct AbstractLiteral instances directly");
        }
    }

    toJSON() {
        return null;
    }

}
