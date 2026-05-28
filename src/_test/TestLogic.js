import fs from "fs";
import path from "path";
import JSONFile from "../utils/JSONFile.js";
import LogicTester from "./LogicTester.js";
import {generateHTMLog} from "../utils/log/HTMLog.js";

const __dirname = path.resolve();
const testDirName = "tests";
const testDir = path.join(__dirname, testDirName);

const optionsFile = path.join(testDir, "/_config/options.json");
const defaultOptions = JSONFile.read(optionsFile);

const aliasesFile = path.join(testDir, "/_config/aliases.json");
const valueAliases = JSONFile.read(aliasesFile);

export default function testLogic(logic, data = {}, folders = []) {
    const res = {};
    const {
        options: stateOptions = {},
        ...stateData
    } = data;
    const tester = new LogicTester(logic, {
        options: {
            ...defaultOptions,
            ...stateOptions
        },
        ...stateData
    }, valueAliases);
    console.log(tester.getLog());
    tester.clearLog();
    res["."] = runTests(tester, testDir);
    for (const folder of folders) {
        const folderName = path.join(testDir, folder);
        res[folder] = runTests(tester, folderName);
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
                console.log(`➔  test case - ${fileName}`);
                const config = JSONFile.read(fileName);
                res[file] = {
                    result: tester.testCase(config),
                    log: generateHTMLog(file, tester.getLogData())
                };
                console.log(res[file].result.success ? "    ✔ success" : "    ❌ failed");
                tester.clearLog();
            }
        }
    }
    return res;
}
