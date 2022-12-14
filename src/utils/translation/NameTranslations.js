import path from "path";
import JSONCFile from "../JSONCFile.js";

const __dirname = path.resolve();

const translations = JSONCFile.read(path.join(__dirname, "/translation/trans.jsonc"), {});

const requestedKeys = new Set();

class NameTranslations {

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

export default new NameTranslations();
