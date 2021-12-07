import fs from "fs";
import path from "path";
const __dirname = path.resolve();
const inExitSuccessFile  = path.join(__dirname, "/gateways/regionUpdates.json");
const regionUpdates = JSON.parse(fs.readFileSync(inExitSuccessFile, "utf8"));
const regionFile = {
    mainRegions: {},
    subRegions: {}
}

class RegionCheck {
    getRegions() {
        if(regionUpdates.mainregions !== null) {
            regionFile.mainRegions = regionUpdates.mainRegions
            regionFile.subRegions = regionUpdates.subRegions
        }
    }

    checkRegions(importRegions) {
        let data = {
            mainRegions: {},
            subRegions: {}
        }
        this.getRegions()
        data = this.checkNew(data, importRegions);
        this.checkRemoved(importRegions);
        fs.writeFileSync(`${__dirname}/gateways/regionUpdates.json`, JSON.stringify(data, null, 4));
    }
    checkNew(data = null, importRegions = null) {
        for (const traverse in importRegions) {
            data[traverse] = {}
            let topLevel = importRegions[traverse]
            let topLevelFile = regionFile[traverse]

            for(const secondTraverse in topLevel) {
                if(traverse === "mainRegions") {
                    //data[traverse][secondTraverse] = false
                    if(typeof topLevelFile[secondTraverse] === "undefined") {
                        data[traverse][secondTraverse] = true;
                        console.log(`${traverse}: ${secondTraverse} is new`)
                    } else {
                        data[traverse][secondTraverse] = false
                    }
                } else {
                    data[traverse][secondTraverse] = {}
                    let secondLevel = topLevel[secondTraverse]
                    let secondLevelFile = topLevelFile[secondTraverse]
                    if(typeof secondLevelFile === "undefined") secondLevelFile = {}

                    for (const thirdTraverse in secondLevel) {
                        if(typeof secondLevelFile[thirdTraverse] === "undefined") {
                            data[traverse][secondTraverse][thirdTraverse] = true;
                            console.log(`${traverse}: ${secondTraverse}: ${thirdTraverse} is new`)
                        } else {
                            data[traverse][secondTraverse][thirdTraverse] = false
                        }
                    }
                }
            }
        }

        return data;
    }

    checkRemoved(importRegions = null) {
        for (const traverse in regionFile) {
            let topLevelImport = importRegions[traverse]
            let topLevel = regionFile[traverse]

            for(const secondTraverse in topLevel) {
                if(traverse === "mainRegions") {
                    if(typeof topLevelImport[secondTraverse] === "undefined") console.log(`${traverse}: ${secondTraverse} doesn't exist anymore`)
                } else {
                    let secondLevelImport = topLevelImport[secondTraverse]
                    if(typeof secondLevelImport === "undefined") secondLevelImport = {}
                    let secondLevel = topLevel[secondTraverse]

                    for (const thirdTraverse in secondLevel) {
                        if(typeof secondLevelImport[thirdTraverse] === "undefined") console.log(`${traverse}: ${secondTraverse}: ${thirdTraverse} doesn't exist anymore`)
                    }
                }
            }
        }
    }
}

export default new RegionCheck();