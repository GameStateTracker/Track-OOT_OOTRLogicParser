import fs from "fs";

const inFileName = process.argv[2] ?? "./_trans/missing.json";
const outFileName = "./_trans/translated.json";
const localizationFileName = "./_trans/localization.lang";

const PREFIXES = {
    "KF": "kokiri",
    "LW": "woods",
    "SFM": "meadow",
    "HF": "hyrule_field",
    "GV": "gerudo_valley",
    "GF": "gerudo_fortress",
    "Hideout": "hideout",
    "Wasteland": "desert",
    "Colossus": "colossus",
    "Market": "market",
    "ToT": "tot",
    "HC": "castle",
    "OGC": "outside_ganons_castle",
    "Kak": "kakariko",
    "Graveyard": "graveyard",
    "ZR": "river",
    "ZD": "zoras",
    "ZF": "fountain",
    "LH": "lake",
    "LLR": "lonlon",
    "GC": "goron",
    "DMT": "mountain",
    "DMC": "crater",
    "Deku Tree MQ": "deku_mq",
    "Deku Tree": "deku",
    "Dodongos Cavern MQ": "dodongo_mq",
    "Dodongos Cavern": "dodongo",
    "Jabu Jabus Belly MQ": "jabujabu_mq",
    "Jabu Jabus Belly": "jabujabu",
    "Bottom of the Well MQ": "well_mq",
    "Bottom of the Well": "well",
    "Forest Temple MQ": "temple_forest_mq",
    "Forest Temple": "temple_forest",
    "Fire Temple MQ": "temple_fire_mq",
    "Fire Temple": "temple_fire",
    "Water Temple MQ": "temple_water_mq",
    "Water Temple": "temple_water",
    "Shadow Temple MQ": "temple_shadow_mq",
    "Shadow Temple": "temple_shadow",
    "Spirit Temple MQ": "temple_spirit_mq",
    "Spirit Temple": "temple_spirit",
    "Ice Cavern MQ": "ice_cavern_mq",
    "Ice Cavern": "ice_cavern",
    "Gerudo Training Ground MQ": "training_grounds_mq",
    "Gerudo Training Ground": "training_grounds",
    "Ganons Castle MQ": "ganons_castle_mq",
    "Ganons Castle": "ganons_castle",
    "Ganons Tower": "ganons_tower"
};

function translateKey(key) {
    for (const prefix in PREFIXES) {
        const paddedPrefix = prefix + " ";
        if (key.startsWith(paddedPrefix)) {
            const [, location] = key.split(paddedPrefix);
            const locationKey = location.toLowerCase().replace(/ |-/g, "_");
            return `${PREFIXES[prefix]}.${locationKey}`;
        }
    }
    return key.toLowerCase().replace(/ |-/g, "_");
}

function getInData() {
    try {
        const fileData = fs.readFileSync(inFileName).toString();
        try {
            return JSON.parse(fileData);
        } catch {
            return fileData.split(/(\r\n|\n|\r)/);
        }
    } catch {
        return [];
    }
}

const inData = getInData();

const outData = {};
const localizationData = [];

if (Array.isArray(inData)) {
    for (const key of inData) {
        const cleanKey = key.trim();
        if (cleanKey === "") {
            continue;
        }
        const translatedKey = translateKey(cleanKey);
        outData[cleanKey] = translatedKey;
        localizationData.push(`${translatedKey}=${cleanKey}`);
    }
} else {
    for (const key in inData) {
        const cleanKey = key.trim();
        if (cleanKey === "") {
            continue;
        }
        const translatedKey = translateKey(cleanKey);
        outData[cleanKey] = translatedKey;
        localizationData.push(`${translatedKey}=${cleanKey}`);
    }
}

fs.writeFileSync(outFileName, JSON.stringify(outData, null, 4) + "\n");
fs.writeFileSync(localizationFileName, localizationData.join("\n") + "\n");
