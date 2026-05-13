import LogicDataStorage from "../storage/logic/LogicDataStorage.js";
import LogicGraph from "./LogicGraph.js";
import "./NodeFactory.js";
import augmentDungeonShortcuts from "./augment/AugmentDungeonShortcuts.js";
import augmentReachEpona from "./augment/AugmentReachEpona.js";
import augmentTotalHearts from "./augment/AugmentTotalHearts.js";
import augmentZeldaLetter from "./augment/AugmentZeldaLetter.js";
import augmentZoraLetter from "./augment/AugmentZoraLetter.js";

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

    #processor = new LogicGraph(DEBUG_VALUES[DEBUG_LVL]);

    #processorProxy = new ProcessorProxy(this.#processor);

    #presetData;

    constructor(logic, presetData = {}) {
        this.#processor.load(logic);
        this.#presetData = presetData;
        // load collectibles
        this.#processor.setCollectible("reach_location[master_sword]", "flag[time_travel]");
    }

    getLogData() {
        return this.#processor.getLogData();
    }

    getLog() {
        return this.#processor.getLog();
    }

    clearLog() {
        this.#processor.clearLog();
    }

    testCase(config) {
        const {
            state = {},
            settings = {},
            startNode = "region[root]",
            reachableNodes = [],
            unreachableNodes = []
        } = config;

        this.#processor.reset();
        const data = this.#collectData(state, settings);
        const dataStorage = new LogicDataStorage();
        dataStorage.setData(data);

        for (const augment of AUGMENTS) {
            augment(dataStorage.restricted, this.#processorProxy);
        }

        this.#processor.setAll({
            ...dataStorage.getAll(),
            ...this.#presetData
        });
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
