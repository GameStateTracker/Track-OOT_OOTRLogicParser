import EventTranslations from "./translation/EventTranslations.js";
import NameTranslations from "./translation/NameTranslations.js";
import StateTranslations from "./translation/StateTranslations.js";
import ValueTranslations from "./translation/ValueTranslations.js";

class Translation {

    translateName(value) {
        return NameTranslations.translate(value);
    }

    translateEvent(value) {
        return EventTranslations.translate(value);
    }

    getValueName(value) {
        return ValueTranslations.translate(value);
    }

    getStateConfig(value) {
        return StateTranslations.translate(value);
    }

}

export default new Translation();
