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

function testLogic_OOTR_vanilla() {
    const logic = JSONFile.read(`${inputDir}/vanilla.readable.json`);

    console.log("\n\n-- test logic - OOTR Vanilla --");
    const testResults = testLogic(logic, {"$IS_AP_STATE": false}, ["ootr", "ootr/vanilla"]);
    const testResultsData = JSON.stringify(testResults, null, 4);
    fs.writeFileSync(`${outputDir}/vanilla.json`, testResultsData);
}

function testLogic_OOTR_glitched() {
    const logic = JSONFile.read(`${inputDir}/glitched.readable.json`);

    console.log("\n\n-- test logic - OOTR Glitched --");
    const testResults = testLogic(logic, {"$IS_AP_STATE": false}, ["ootr", "ootr/glitched"]);
    const testResultsData = JSON.stringify(testResults, null, 4);
    fs.writeFileSync(`${outputDir}/glitched.json`, testResultsData);
}

function testLogic_AP_vanilla() {
    const logic = JSONFile.read(`${inputDir}/ap_vanilla.readable.json`);

    console.log("\n\n-- test logic - AP Vanilla --");
    const testResults = testLogic(logic, {"$IS_AP_STATE": true}, ["ap", "ap/vanilla"]);
    const testResultsData = JSON.stringify(testResults, null, 4);
    fs.writeFileSync(`${outputDir}/ap_vanilla.json`, testResultsData);
}

function testLogic_AP_glitched() {
    const logic = JSONFile.read(`${inputDir}/ap_glitched.readable.json`);

    console.log("\n\n-- test logic - AP Glitched --");
    const testResults = testLogic(logic, {"$IS_AP_STATE": true}, ["ap", "ap/glitched"]);
    const testResultsData = JSON.stringify(testResults, null, 4);
    fs.writeFileSync(`${outputDir}/ap_glitched.json`, testResultsData);
}

testLogic_OOTR_vanilla();
testLogic_OOTR_glitched();
testLogic_AP_vanilla();
testLogic_AP_glitched();

