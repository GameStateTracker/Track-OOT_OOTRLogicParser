import {
    immute
} from "../Immutable.js";
import {
    loadDictFolder
} from "../fs/JSONFolderLoader.js";

const data = loadDictFolder("/config/rebind");

export const rebindData = immute(data);
