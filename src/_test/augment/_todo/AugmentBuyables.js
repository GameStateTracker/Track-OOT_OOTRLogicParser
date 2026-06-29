import LogicCaller from "/GameTrackerJS/util/logic/LogicCaller.js";
import ShopsResource from "../../../resource/ShopsResource.js";

const BUYABLE_ITEMS = {
    // "shield_kokiri_1": "buyable[shield_kokiri]",
    // "shield_hylia_1": "buyable[shield_hylia]",
    // "tunic_fire_1": "buyable[tunic_fire]",
    // "tunic_water_1": "buyable[tunic_water]",
    "blue_fire_1": "buyable[blue_fire]",
    "bugs_1": "buyable[bugs]",
    "fairy_spirit_1": "buyable[fairy]",
    "fish_1": "buyable[fish]",
    "stick_1": "buyable[sticks]",
    "nuts_5": "buyable[nuts]",
    "nuts_10": "buyable[nuts]"
};

function augment(cache) {
    if (cache.get("option[shopsanity]") === "off") {
        if (cache.hasChange("option[shopsanity]")) {
            const shops = ShopsResource.get();
            for (const name in shops) {
                for (let slot = 0; slot < 8; ++slot) {
                    const slotRef = shops[name][slot].ref;
                    const slotItem = shops[name][slot].item;
                    if (slotItem in BUYABLE_ITEMS) {
                        const buyableRef = BUYABLE_ITEMS[slotItem];
                        LogicCaller.setCollectible(`reach_location[${slotRef}]`, buyableRef);
                    } else {
                        LogicCaller.deleteCollectible(`reach_location[${slotRef}]`);
                    }
                }
            }
        }
    } else {
        const shops = ShopsResource.get();
        if (cache.hasChange("option[shopsanity]")) {
            for (const name in shops) {
                for (let slot = 0; slot < 8; ++slot) {
                    const slotRef = shops[name][slot].ref;
                    LogicCaller.deleteCollectible(`reach_location[${slotRef}]`);
                }
            }
        }
        for (const name in shops) {
            for (let slot = 0; slot < 8; ++slot) {
                const slotRef = shops[name][slot].ref;
                if (cache.hasChange(slotRef)) {
                    const currItem = cache.get(slotRef);
                    if (currItem in BUYABLE_ITEMS) {
                        const buyableRef = BUYABLE_ITEMS[currItem];
                        LogicCaller.setCollectible(`reach_location[${slotRef}]`, buyableRef);
                    } else {
                        LogicCaller.deleteCollectible(`reach_location[${slotRef}]`);
                    }
                }
            }
        }
    }
}

LogicCaller.registerAugment(augment);
