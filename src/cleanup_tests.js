import fs from "fs";
import path from "path";
import JSONFile from "./utils/JSONFile.js";

const __dirname = path.resolve();
const testDirName = "tests";
const testDir = path.join(__dirname, testDirName);

function cleanupTests(folderName) {
    if (fs.existsSync(folderName)) {
        const files = fs.readdirSync(folderName);
        for (const file of files) {
            if ([".", "..", "_config"].includes(file)) {
                continue;
            }
            const fileName = path.join(folderName, file);
            const fileStat = fs.lstatSync(fileName);
            if (fileStat.isDirectory()) {
                cleanupTests(fileName);
            } else if (fileStat.isFile() && fileName.endsWith(".json")) {
                const config = JSONFile.read(fileName);
                const newConfig = {
                    state: config.state ?? {},
                    flags: config.flags ?? {},
                    forceReach: config.forceReach ?? [],
                    settings: config.settings ?? {},
                    close_off: config.close_off ?? [],
                    redirects: config.redirects ?? [],
                    startNode: config.startNode ?? "region[root]",
                    passedNodes: Array.from(new Set(config.passedNodes ?? [])),
                    missingNodes: Array.from(new Set(config.missingNodes ?? [])),
                    brokenNodes: Array.from(new Set(config.brokenNodes ?? [])),
                    reachableNodes: Array.from(new Set(config.reachableNodes ?? [])),
                    unreachableNodes: Array.from(new Set(config.unreachableNodes ?? []))
                };
                JSONFile.write(fileName, newConfig);
            }
        }
    }
}

cleanupTests(testDir);
