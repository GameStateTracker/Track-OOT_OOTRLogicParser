export default function augmentZeldaLetter(cache) {
    // augment zeldas letter
    if (cache.hasChange("item[zeldas_letter]") || cache.hasChange("option[skip_child_zelda]")) {
        if (cache.get("option[skip_child_zelda]")) {
            cache.setAugmented("item[zeldas_letter]", 1);
        } else {
            cache.deleteAugmented("item[zeldas_letter]");
        }
    }
}
