import fs from "fs";
import path from "path";
import JSONFile from "../utils/JSONFile.js";
import LogicTester from "./LogicTester.js";

const __dirname = path.resolve();
const testDir = path.join(__dirname, "tests");

export default function testLogic(logic, data) {
    const res = {};
    const tester = new LogicTester(logic, data);
    const files = fs.readdirSync(testDir);
    for (const file of files) {
        const iname = path.join(testDir, file);
        const config = JSONFile.read(iname);
        res[file] = tester.testCase(config);
    }
    return res;
}
