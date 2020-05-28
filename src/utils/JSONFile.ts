import fs from "fs";

declare global {
    type JSONObject = string | number | boolean | JSONArray | JSONMap;
    type JSONArray = JSONObject[];
    type JSONMap = { [index: string]: JSONObject };
}

export default abstract class JSONFile {

    public static read(filename: string, def: JSONObject): JSONObject {
        if (fs.existsSync(filename)) {
            let data = fs.readFileSync(filename).toString();
            return JSON.parse(data);
        }
        return def;
    }

    public static write(filename: string, data: JSONObject) {
        fs.writeFileSync(filename, JSON.stringify(data, null, 4));
    }

}