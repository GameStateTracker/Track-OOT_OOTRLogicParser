import path from "path";
import JSONCFile from "../JSONCFile.js";

const __dirname = path.resolve();

const translations = JSONCFile.read(path.join(__dirname, "/translation/values.jsonc"), {});

const requestedKeys = new Set();

class ValueTranslations {

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
        if (translations[value] != null) {
            requestedKeys.add(value);
            return translations[value];
        }
    }

}

export default new ValueTranslations();
