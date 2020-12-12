import fs from "fs";

class JSONFile {

    read(filename, def) {
        if (fs.existsSync(filename)) {
            const data = fs.readFileSync(filename).toString();
            return JSON.parse(data);
        }
        return def;
    }

    write(filename, data) {
        fs.writeFileSync(filename, JSON.stringify(data, null, 4));
    }

    parse(input) {
        return JSON.parse(input);
    }

}

export default new JSONFile();
