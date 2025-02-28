import fs from "fs";
import path from "path";

const __dirname = path.resolve();

/* files */
const bluewarpInFileName  = path.join(__dirname, "/config/gateways/bluewarp.json");
const specialInFileName  = path.join(__dirname, "/config/gateways/special.json");
const overworldInFileName  = path.join(__dirname, "/config/gateways/overworld.json");
const dungeonInFileName  = path.join(__dirname, "/config/gateways/dungeon.json");
const bossesInFileName  = path.join(__dirname, "/config/gateways/bosses.json");
const interiorInFileName  = path.join(__dirname, "/config/gateways/interior.json");
const grottoInFileName  = path.join(__dirname, "/config/gateways/grotto.json");

/* modificator */

function modify(source = [], target = []) {
    // overworld
    for (const region of source) {
        const inRegion = {
            "region_name": `${region["region_name"]}:In`,
            "exits": {}
        };
        const outRegion = {
            "region_name": `${region["region_name"]}:Out`,
            "exits": {}
        };
        for (const ref in region["exits"]) {
            if (ref.endsWith(" Gateway")) {
                inRegion["exits"][`${ref}:Out`] = "True";
            } else {
                outRegion["exits"][ref] = region["exits"][ref];
            }
        }
        if (Object.keys(inRegion["exits"]).length > 0) {
            target.push(inRegion);
        }
        if (Object.keys(outRegion["exits"]).length > 0) {
            target.push(outRegion);
        }
    }
}

/* module */

const bluewarpInData = JSON.parse(fs.readFileSync(bluewarpInFileName));
const specialInData = JSON.parse(fs.readFileSync(specialInFileName));
const overworldInData = JSON.parse(fs.readFileSync(overworldInFileName));
const dungeonInData = JSON.parse(fs.readFileSync(dungeonInFileName));
const bossesInData = JSON.parse(fs.readFileSync(bossesInFileName));
const interiorInData = JSON.parse(fs.readFileSync(interiorInFileName));
const grottoInData = JSON.parse(fs.readFileSync(grottoInFileName));

const outData = [];

modify([
    ...bluewarpInData,
    ...specialInData,
    ...overworldInData,
    ...dungeonInData,
    ...bossesInData,
    ...grottoInData,
    ...interiorInData
], outData);

export const gatewayData = JSON.parse(JSON.stringify(outData));
