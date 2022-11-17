import path from "path";
import JSONCFile from "./JSONCFile.js";

const __dirname = path.resolve();

const translation = JSONCFile.read(path.join(__dirname, "/translation/trans.jsonc"), {});

const values = JSONCFile.read(path.join(__dirname, "/translation/values.jsonc"), {});
const states = JSONCFile.read(path.join(__dirname, "/translation/states.jsonc"), {});

const rules = new Map();

class Translation {

    addRule(matches, expects) {
        rules.set(matches, expects);
    }

    translateName(value) {
        if (translation[value] != null) {
            return translation[value];
        }
    }

    getValueName(value) {
        const newValue = value.replace(/ /g, "_").replace(/^'(.*)'$/g, "$1");
        return values[newValue] ?? values[value] ?? undefined;
    }

    getStateConfig(value) {
        value = value.replace(/ /g, "_").replace(/^'|'$/g, "");
        if (states[value] != null) {
            const res = states[value];
            return res;
        }
    }

}

export default new Translation();
