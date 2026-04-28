import fs from "fs";
import path from "path";
import JSONFile from "../utils/JSONFile.js";
import LogicTester from "./LogicTester.js";

const __dirname = path.resolve();
const testDirName = "tests";
const testDir = path.join(__dirname, testDirName);

const optionsFile = path.join(testDir, "/_config/options.json");
const defaultOptions = JSONFile.read(optionsFile);

export default function testLogic(logic, data, folders = []) {
    const res = {};
    const tester = new LogicTester(logic, {
        ...defaultOptions,
        ...data
    });
    res[testDirName] = runTests(tester, testDir);
    for (const folder of folders) {
        const folderName = path.join(testDir, folder);
        res[`${testDirName}/${folder}`] = runTests(tester, folderName);
    }
    return res;
}

function runTests(tester, folderName) {
    const res = {};
    if (fs.existsSync(folderName)) {
        const files = fs.readdirSync(folderName);
        for (const file of files) {
            const fileName = path.join(folderName, file);
            const fileStat = fs.lstatSync(fileName);
            if  (fileStat.isFile()) {
                console.log(`\n-> test case - ${fileName}`);
                const config = JSONFile.read(fileName);
                res[file] = tester.testCase(config);
            }
        }
    }
    return res;
}
