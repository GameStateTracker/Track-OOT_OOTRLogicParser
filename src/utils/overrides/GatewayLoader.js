import {
    immute
} from "../Immutable.js";
import {
    loadArrayFolder
} from "../fs/JSONFolderLoader.js";

const data = loadArrayFolder("/config/gateways");

function modify(source = []) {
    const result = [];
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
            result.push(inRegion);
        }
        if (Object.keys(outRegion["exits"]).length > 0) {
            result.push(outRegion);
        }
    }
    return result;
}

export const gatewayData = immute(modify(data));
