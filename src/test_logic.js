import fs from "fs";
import path from "path";
import testLogic from "./_test/TestLogic.js";
import JSONFile from "./utils/JSONFile.js";

const __dirname = path.resolve();

const inputDir = path.join(__dirname, "/output/");
const outputDir = path.join(__dirname, "/tests_results/");

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

function runTestLogic(testName, logicFile, data, folders) {
    console.log(`\n-- test logic - ${testName} --`);
    const logic = JSONFile.read(logicFile);
    const testResults = testLogic(logic, data, folders);
    for (const pname in testResults) {
        const folder = testResults[pname];
        if (!fs.existsSync(`${outputDir}/${testName}/${pname}`)) {
            fs.mkdirSync(`${outputDir}/${testName}/${pname}`, {recursive: true});
        }
        for (const fname in folder) {
            const {
                result, log
            } = folder[fname];
            const testResultsData = JSON.stringify(result, null, 4);
            fs.writeFileSync(`${outputDir}/${testName}/${pname}/${fname}`, testResultsData);
            fs.writeFileSync(`${outputDir}/${testName}/${pname}/${fname}.html`, log);
        }
    }
}

const TESTS = [
    () => {
        runTestLogic("OOTR Vanilla", `${inputDir}/vanilla.readable.json`, {"$IS_AP_STATE": false}, ["ootr", "ootr/vanilla"]);
    },
    () => {
        runTestLogic("OOTR Glitched", `${inputDir}/glitched.readable.json`, {"$IS_AP_STATE": false}, ["ootr", "ootr/glitched"]);
    },
    () => {
        runTestLogic("AP Vanilla", `${inputDir}/ap_vanilla.readable.json`, {"$IS_AP_STATE": true}, ["ap", "ap/can_clear", "ap/vanilla"]);
    },
    () => {
        runTestLogic("AP Glitched", `${inputDir}/ap_glitched.readable.json`, {"$IS_AP_STATE": true}, ["ap", "ap/can_clear", "ap/glitched"]);
    }
];

for (const test of TESTS) {
    test();
}

