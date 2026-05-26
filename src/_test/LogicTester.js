import LogicGraph from "@emcjs/logic/processor/LogicGraph.js";
import LogicDataStorage from "@emcjs/logic/data/LogicDataStorage.js";
import augmentDungeonShortcuts from "./augment/AugmentDungeonShortcuts.js";
import augmentReachEpona from "./augment/AugmentReachEpona.js";
import augmentTotalHearts from "./augment/AugmentTotalHearts.js";
import augmentZeldaLetter from "./augment/AugmentZeldaLetter.js";
import augmentZoraLetter from "./augment/AugmentZoraLetter.js";
import JSONLog from "../utils/log/JSONLog.js";

const DEBUG_LVL = 2;
const DEBUG_VALUES = [
    false, true, "extended"
];

const AUGMENTS = [
    augmentDungeonShortcuts,
    augmentReachEpona,
    augmentTotalHearts,
    augmentZeldaLetter,
    augmentZoraLetter
];

export default class LogicTester {

    #logger = new JSONLog();

    #processor = new LogicGraph(DEBUG_VALUES[DEBUG_LVL]);

    #processorProxy = new ProcessorProxy(this.#processor);

    #presetData;

    constructor(logic, presetData = {}, valueAliases = {}) {
        this.#processor.setLogger(this.#logger);
        this.#processor.load(logic);
        for (const key in valueAliases) {
            const value = valueAliases[key];
            this.#processor.setValueAlias(key, value);
        }
        this.#presetData = presetData;
        // load collectibles
        this.#processor.setCollectible("reach_location[master_sword]", "flag[time_travel]");
    }

    getLogData() {
        return this.#logger.getData();
    }

    getLog() {
        return this.#logger.getLog();
    }

    clearLog() {
        this.#logger.clear();
    }

    testCase(config) {
        const {
            state = {},
            flags = {},
            settings = {},
            close_off = [],
            redirects = [],
            startNode = "region[root]",
            reachableNodes = [],
            unreachableNodes = []
        } = config;

        this.#processor.reset();
        this.#processor.clearRedirects();
        const dataStorage = new LogicDataStorage();
        const presetData = this.#collectData(this.#presetData);
        dataStorage.setData(presetData);
        const data = this.#collectData(state, settings);
        dataStorage.setData(data);

        for (const augment of AUGMENTS) {
            augment(dataStorage.restricted, this.#processorProxy);
        }

        this.#processor.setAll(dataStorage.getAll());
        this.#processor.setAllRedirects(this.#collectClosedOff(close_off));
        this.#processor.setAllRedirects(redirects);

        for (const [key, value] of Object.entries(flags)) {
            this.#processor.set(`flag[${key}]`, value);
        }

        this.#processor.traverse(startNode);

        const res = {
            reachable: {},
            unreachable: {}
        };
        for (const node of reachableNodes) {
            res.reachable[node] = this.#processor.get(node);
        }
        for (const node of unreachableNodes) {
            res.unreachable[node] = !this.#processor.get(node);
        }
        return res;
    }

    #collectClosedOff(close_off) {
        const res = [];
        for (const entry of close_off) {
            const {
                source,
                target
            } = entry;
            res.push({
                source: `${source}{child}`,
                target: `${target}{child}`,
                reroute: ""
            });
            res.push({
                source: `${source}{adult}`,
                target: `${target}{adult}`,
                reroute: ""
            });
        }
        return res;
    }

    #collectData(state, settings) {
        const res = {};
        const {
            items,
            locations,
            options,
            filter,
            areaActiveLists,
            exitBindings
        } = state;

        if (items != null) {
            for (const [key, value] of Object.entries(items)) {
                res[`item[${key}]`] = value;
            }
        }

        if (locations != null) {
            for (const [key, value] of Object.entries(locations)) {
                res[`location[${key}]`] = value;
            }
        }

        if (options != null) {
            for (const [key, value] of Object.entries(options)) {
                res[`option[${key}]`] = value;
            }
        }

        if (filter != null) {
            for (const [key, value] of Object.entries(filter)) {
                res[`filter[${key}]`] = value;
            }
        }

        if (areaActiveLists != null) {
            for (const [key, value] of Object.entries(areaActiveLists)) {
                res[`arealist[${key}]`] = value;
            }
        }

        if (exitBindings != null) {
            for (const [key, value] of Object.entries(exitBindings)) {
                res[`exitBindings[${key}]`] = value;
            }
        }

        if (settings != null) {
            for (const [key, value] of Object.entries(settings)) {
                res[`setting[${key}]`] = value;
            }
        }

        return res;
    }

}

class ProcessorProxy {

    #processor;

    constructor(processor) {
        this.#processor = processor;
    }

    addReachable(target) {
        this.#processor.addReachable(target);
    }

    deleteReachable(target) {
        this.#processor.deleteReachable(target);
    }

    clearReachables() {
        this.#processor.clearReachables();
    }

    setCollectible(target, value) {
        this.#processor.setCollectible(target, value);
    }

    deleteCollectible(target) {
        this.#processor.deleteCollectible(target);
    }

    clearCollectibles() {
        this.#processor.clearCollectibles();
    }

}
