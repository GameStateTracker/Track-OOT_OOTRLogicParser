import path from "path";
import JSONCFile from "../JSONCFile.js";

const __dirname = path.resolve();

const translations = JSONCFile.read(path.join(__dirname, "/translation/states.jsonc"), {});
const ignoredValueMatchers = JSONCFile.read(path.join(__dirname, "/config/ignoredValueMatchers.json"), []);

const ignoredValues = [];
for (const matcher of ignoredValueMatchers) {
    ignoredValues.push(new RegExp(matcher));
}

const requestedKeys = new Set();

class StateTranslations {

    reset() {
        requestedKeys.clear();
    }

    getUnusedKeys() {
        const result = [];

        for (const key in translations) {
            if (!requestedKeys.has(key)) {
                result.push(key);
            }
        }

        return result;
    }

    translate(value) {
        const knownValue = ignoredValues.some((matcher) => matcher.test(value));
        value = value.replace(/ /g, "_").replace(/^'|'$/g, "");
        if (translations[value] != null) {
            if (!knownValue) {
                requestedKeys.add(value);
            }
            return translations[value];
        }
    }

}

export default new StateTranslations();
