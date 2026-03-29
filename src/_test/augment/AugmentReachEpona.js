export default function augmentReachEpona(cache, logicProxy) {
    // augment epona
    if (cache.hasChange("option[skip_epona_race]")) {
        if (cache.get("option[skip_epona_race]")) {
            logicProxy.addReachable("event[epona]");
        } else {
            logicProxy.deleteReachable("event[epona]");
        }
    }
}
