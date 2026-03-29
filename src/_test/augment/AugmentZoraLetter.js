export default function augmentZoraLetter(cache) {
    // augment zoras letter
    if (cache.hasChange("item[zora_letter]") || cache.hasChange("option[doors_open_zora]")) {
        if (cache.get("option[doors_open_zora]") == "doors_open_zora_both") {
            cache.setAugmented("item[zora_letter]", 1);
        } else {
            cache.deleteAugmented("item[zora_letter]");
        }
    }
}
