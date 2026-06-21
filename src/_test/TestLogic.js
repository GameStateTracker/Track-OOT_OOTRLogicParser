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

const itemsFile = path.join(testDir, "/_config/items.json");
const defaultItems = JSONFile.read(itemsFile);

const aliasesFile = path.join(testDir, "/_config/aliases.json");
const valueAliases = JSONFile.read(aliasesFile);

export default function testLogic(logic, data = {}, folders = []) {
    if (!Array.isArray(folders)) {
        folders = [folders];
    }
    const res = {};
    const {
        options: stateOptions = {},
        items: stateItems = {},
        ...stateData
    } = data;
    const tester = new LogicTester(logic, {
        options: {
            ...defaultOptions,
            ...stateOptions
        },
        items: {
            ...defaultItems,
            ...stateItems
        },
        ...stateData
    }, valueAliases);
    console.log(tester.getLog());
    tester.clearLog();
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
            if ([".", ".."].includes(file)) {
                continue;
            }
            const fileName = path.join(folderName, file);
            const fileStat = fs.lstatSync(fileName);
            if (fileStat.isDirectory()) {
                res[file] = {
                    type: "folder",
                    content: runTests(tester, fileName)
                };
            } else if (fileStat.isFile()) {
                console.log(`➔  test case - ${fileName}`);
                const config = JSONFile.read(fileName);
                res[file] = {
                    type: "result",
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
