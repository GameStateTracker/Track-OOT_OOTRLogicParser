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
    let success = 0;
    let failed = 0;
    for (const pname in testResults) {
        const folder = testResults[pname];
        const res = writeResults(`${testName}/${pname}`, folder);
        success += res.success;
        failed += res.failed;
    }
    console.log(`\n✔ success: ${success} | ❌ failed: ${failed}\n`);
}

function writeResults(pname, testResults) {
    if (!fs.existsSync(`${outputDir}/${pname}`)) {
        fs.mkdirSync(`${outputDir}/${pname}`, {recursive: true});
    }
    let success = 0;
    let failed = 0;
    for (const fname in testResults) {
        const testResult = testResults[fname];
        if (testResult.type === "folder") {
            const res = writeResults(`${pname}/${fname}`, testResult.content);
            success += res.success;
            failed += res.failed;
        } else if (testResult.type === "result") {
            const {
                result, log
            } = testResult;
            if (result.success) {
                success++;
            } else {
                failed++;
            }
            const testResultsData = JSON.stringify(result, null, 4);
            fs.writeFileSync(`${outputDir}/${pname}/${fname}`, testResultsData);
            fs.writeFileSync(`${outputDir}/${pname}/${fname}.html`, log);
        }
    }
    return {
        success,
        failed
    };
}

const TESTS = [
    () => {
        runTestLogic("OOTR Vanilla", `${inputDir}/vanilla.readable.json`, {"$IS_AP_STATE": false}, [
            "_general",
            "ootr/vanilla"
        ]);
    },
    () => {
        runTestLogic("OOTR Glitched", `${inputDir}/glitched.readable.json`, {"$IS_AP_STATE": false}, [
            "_general",
            "ootr/glitched"
        ]);
    },
    () => {
        runTestLogic("AP Vanilla", `${inputDir}/ap_vanilla.readable.json`, {"$IS_AP_STATE": true}, [
            "_general",
            "ap/vanilla"
        ]);
    },
    () => {
        runTestLogic("AP Glitched", `${inputDir}/ap_glitched.readable.json`, {"$IS_AP_STATE": true}, [
            "_general",
            "ap/glitched"
        ]);
    }
];

for (const test of TESTS) {
    test();
}

