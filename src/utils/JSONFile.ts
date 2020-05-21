import fs from "fs";

export default class JSONFile {

    private constructor() { }

    public static read(filename: string, def: any): any {
        if (fs.existsSync(filename)) {
            let data = fs.readFileSync(filename).toString();
            return JSON.parse(data);
        }
        return def;
    }

    public static write(filename: string, data: any) {
        fs.writeFileSync(filename, JSON.stringify(data, null, 4));
    }

}