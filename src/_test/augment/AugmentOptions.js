export default function augment(cache) {
    // open forest
    if (
        cache.hasChange("option[doors_open_forest]") ||
        cache.hasChange("option[entrance_shuffle_interior]") ||
        cache.hasChange("option[shuffle_warps]") ||
        cache.hasChange("option[shuffle_spawns]") ||
        cache.hasChange("option[shuffle_overworld]")
    ) {
        const openForest = cache.get("option[doors_open_forest]");
        if (openForest == "doors_open_forest_closed") {
            const shuffleSpecialInterior = cache.get("option[entrance_shuffle_interior]") == "entrance_shuffle_all";
            const shuffleWarps = cache.get("option[shuffle_warps]");
            const shuffleSpawns = cache.get("option[shuffle_spawns]");
            const shuffleOverworld = cache.get("option[shuffle_overworld]");
            if (shuffleSpecialInterior || shuffleOverworld || shuffleWarps || shuffleSpawns) {
                cache.setAugmented("option[doors_open_forest]", "doors_open_forest_deku");
            } else {
                cache.deleteAugmented("option[doors_open_forest]");
            }
        }
    }
    // selected adult trade item
    const adultTradeShuffle = cache.get("option[adult_trade_shuffle]");
    const adultTradeStart = cache.get("option[trade_sequence_start_item]");
    if (!adultTradeShuffle && adultTradeStart?.length) {
        for (const tradeItem of adultTradeStart) {
            const collectedTradeItem = cache.get(tradeItem);
            if (collectedTradeItem) {
                cache.setAugmented("randomized[selected_adult_trade_item]", tradeItem);
                break;
            }
        }
    }
}
