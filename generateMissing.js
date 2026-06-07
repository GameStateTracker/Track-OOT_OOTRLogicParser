import fs from "fs";

const shops = {
    "Market Mask Shop Item 1": "market.mask_shop_1",
    "Market Mask Shop Item 2": "market.mask_shop_2",
    "Market Mask Shop Item 3": "market.mask_shop_3",
    "Market Mask Shop Item 4": "market.mask_shop_4",
    "Market Mask Shop Item 5": "market.mask_shop_5",
    "Market Mask Shop Item 6": "market.mask_shop_6",
    "Market Mask Shop Item 7": "market.mask_shop_7",
    "Market Mask Shop Item 8": "market.mask_shop_8"
};

const chests = {
    "Kak Granny Buy Blue Potion": "kakariko.c_granny_buy_blue_potion",
    "Market Treasure Chest Game Salesman": "market.c_treasure_chest_game_salesman",
    "Market Treasure Chest Game Room 1 Bottom": "market.c_treasure_chest_game_room_1_bottom",
    "Market Treasure Chest Game Room 1 Top": "market.c_treasure_chest_game_room_1_top",
    "Market Treasure Chest Game Room 2 Bottom": "market.c_treasure_chest_game_room_2_bottom",
    "Market Treasure Chest Game Room 2 Top": "market.c_treasure_chest_game_room_2_top",
    "Market Treasure Chest Game Room 3 Bottom": "market.c_treasure_chest_game_room_3_bottom",
    "Market Treasure Chest Game Room 3 Top": "market.c_treasure_chest_game_room_3_top",
    "Market Treasure Chest Game Room 4 Bottom": "market.c_treasure_chest_game_room_4_bottom",
    "Market Treasure Chest Game Room 4 Top": "market.c_treasure_chest_game_room_4_top",
    "Market Treasure Chest Game Room 5 Bottom": "market.c_treasure_chest_game_room_5_bottom",
    "Market Treasure Chest Game Room 5 Top": "market.c_treasure_chest_game_room_5_top",
    "Market Bombchu Bowling Bomb": "market.c_bombchu_bowling_bomb",
    "LH Loach Fishing": "lake.c_loach_fishing"
};

const trade = {
    "LW Trade Cojiro": "woods.c_trade_cojiro",
    "LW Trade Odd Potion": "woods.c_trade_odd_potion",
    "LH Trade Eyeball Frog": "lake.c_trade_eyeball_frog",
    "GV Trade Poachers Saw": "gerudo_valley.c_trade_poachers_saw",
    "DMT Trade Broken Sword": "mountain.c_trade_broken_sword",
    "DMT Trade Eyedrops": "mountain.c_trade_eyedrops",
    "ZD Trade Prescription": "zora.c_trade_prescription",
    "Kak Granny Trade Odd Mushroom": "kakariko.c_granny_trade_odd_mushroom",
    "Kak Anju Trade Pocket Cucco": "kakariko.c_anju_trade_pocket_cucco"
};

const res = {};

for (const entry of Object.values(chests)) {
    res[entry] = {
        "type": "chest",
        "logicAccess": `reach_location[${entry}]`,
        "visible": true,
        "filter": {
            "era": {
                "child": true,
                "adult": true
            },
            "time": {
                "day": true,
                "night": true
            },
            "chests": {"false": false},
            "show_done": {
                "false": {
                    "type": "not",
                    "content": {
                        "type": "value",
                        "ref": "$IS_DONE"
                    }
                }
            },
            "show_unavailable": {
                "false": {
                    "type": "not",
                    "content": {
                        "type": "value",
                        "ref": "$IS_UNAVAILABLE"
                    }
                }
            }
        },
        "icon": "/images/icons/chest.svg",
        "tags": []
    };
}

for (const entry of Object.values(shops)) {
    res[entry] = {
        "type": "shopslot",
        "logicAccess": `reach_location[${entry}]`,
        "visible": true,
        "filter": {
            "era": {
                "child": true,
                "adult": true
            },
            "time": {
                "day": true,
                "night": true
            },
            "chests": {"false": false},
            "show_done": {
                "false": {
                    "type": "not",
                    "content": {
                        "type": "value",
                        "ref": "$IS_DONE"
                    }
                }
            }
        },
        "icon": "/images/icons/shops.svg",
        "tags": []
    };
}

for (const entry of Object.values(trade)) {
    res[entry] = {
        "type": "chest",
        "logicAccess": `reach_location[${entry}]`,
        "visible": true,
        "filter": {
            "era": {
                "child": false,
                "adult": true
            },
            "time": {
                "day": true,
                "night": true
            },
            "chests": {"false": false},
            "show_done": {
                "false": {
                    "type": "not",
                    "content": {
                        "type": "value",
                        "ref": "$IS_DONE"
                    }
                }
            }
        },
        "icon": "/images/icons/saw.svg",
        "tags": []
    };
}

fs.writeFileSync("missing locations.json", JSON.stringify(res, null, 4));
