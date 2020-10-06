import NodeFactory from "./NodeFactory.js";
import Compiler from "./EdgeLogicCompiler.js";

const nodeFactory = new NodeFactory();

function mapToObj(map) {
    const res = {};
    map.forEach((v, k) => {
        res[k] = v;
    });
    return res;
}

const DIRTY = new WeakMap();
const MIXINS = new WeakMap();
const MEM_I = new WeakMap();
const MEM_O = new WeakMap();
const DEBUG = new WeakMap();

export default class LogicGraph {

    constructor(debug = false) {
        DIRTY.set(this, false);
        MIXINS.set(this, new Map());
        MEM_I.set(this, new Map());
        MEM_O.set(this, new Map());
        DEBUG.set(this, !!debug);
    }

    clearGraph() {
        nodeFactory.reset();
    }

    load(config) {
        const debug = DEBUG.get(this);
        const mixins = MIXINS.get(this);
        const mem_o = MEM_O.get(this);
        if (debug) {
            console.group("GRAPH LOGIC BUILD");
            console.time("build time");
        }
        for (const name in config.edges) {
            const children = config.edges[name];
            const node = nodeFactory.get(name);
            for (const child in children) {
                const logic = children[child];
                const fn = Compiler.compile(logic);
                node.append(nodeFactory.get(child), fn);
                if (!mem_o.has(child)) {
                    mem_o.set(child, false);
                }
            }
        }
        for (const name in config.logic) {
            const logic = config.logic[name];
            const fn = Compiler.compile(logic);
            mixins.set(name, fn);
        }
        if (debug) {
            console.timeEnd("build time");
            console.groupEnd("GRAPH LOGIC BUILD");
        }
        DIRTY.set(this, true);
    }

    setEdge(source, target, value) {
        const debug = DEBUG.get(this);
        if (debug) {
            console.group("GRAPH LOGIC BUILD");
            console.time("build time");
        }
        const node = nodeFactory.get(source);
        const child = nodeFactory.get(target);
        if (typeof value == "undefined" || value == null) {
            node.remove(child);
            DIRTY.set(this, true);
        } else {
            const fn = Compiler.compile(value);
            node.append(child, fn);
            DIRTY.set(this, true);
        }
        DIRTY.set(this, true);
        if (debug) {
            console.timeEnd("build time");
            console.groupEnd("GRAPH LOGIC BUILD");
        }
    }

    setMixin(name, value) {
        const debug = DEBUG.get(this);
        const mixins = MIXINS.get(this);
        if (debug) {
            console.group("GRAPH LOGIC BUILD");
            console.time("build time");
        }
        if (typeof value == "undefined" || value == null) {
            mixins.delete(name);
            DIRTY.set(this, true);
        } else {
            const fn = Compiler.compile(value);
            mixins.set(name, fn);
            DIRTY.set(this, true);
        }
        sortLogic(logic);
        if (debug) {
            console.timeEnd("build time");
            console.groupEnd("GRAPH LOGIC BUILD");
        }
        DIRTY.set(this, true);
    }

    getEdges() {
        const nodes = nodeFactory.getNames();
        const res = [];
        for (const name of nodes) {
            const node = nodeFactory.get(name);
            const children = node.getTargets();
            for (const ch of children) {
                res.push([name, ch]);
            }
        }
        return res;
    }

    getTargetNodes() {
        const nodes = nodeFactory.getNames();
        const res = new Set();
        for (const name of nodes) {
            const node = nodeFactory.get(name);
            const children = node.getTargets();
            for (const ch of children) {
                res.add(ch);
            }
        }
        return res;
    }

    /* broad search */
    traverse(startNode) {
        const allTargets = this.getTargetNodes();
        const reachableNodes = new Set();
        const traversible = new Set();
        const mixins = MIXINS.get(this);
        const mem_i = MEM_I.get(this);
        const start = nodeFactory.get(startNode);
        if (start != null) {
            function valueGetter(key) {
                if (allTargets.has(key)) {
                    return +reachableNodes.has(key);
                } else if (mem_i.has(key)) {
                    return mem_i.get(key);
                }
            }
            function execute(name) {
                if (mixins.has(name)) {
                    const fn = mixins.get(name);
                    const res = fn(valueGetter, execute);
                    return res;
                }
                return 0;
            }
            const queue = [];
            for (const ch of start.getTargets()) {
                const edge = start.getEdge(ch);
                queue.push(edge);
            }
            let changed = true;
            while(!!queue.length && !!changed) {
                changed = false;
                let counts = queue.length;
                while (!!counts--) {
                    const edge = queue.shift();
                    const condition = edge.getCondition();
                    const cRes = condition(valueGetter, execute);
                    if (cRes) {
                        traversible.add(edge);
                        changed = true;
                        const n = edge.getTarget().getName();
                        const node = nodeFactory.get(n);
                        if(!reachableNodes.has(n)) {
                            reachableNodes.add(n);
                            const targets = node.getTargets();
                            for (const ch of targets) {
                                const edge = node.getEdge(ch);
                                queue.push(edge);
                            }
                        }
                    } else {
                        queue.push(edge);
                    }
                }
            }
            DIRTY.set(this, false);
        }
        return Array.from(traversible);
    }

    set(key, value) {
        const debug = DEBUG.get(this);
        if (debug) {
            console.group("GRAPH LOGIC MEMORY CHANGE");
            console.log("change", `${key} => ${value}`);
        }
        const mem_i = MEM_I.get(this);
        mem_i.set(key, value);
        if (debug) {
            console.groupEnd("GRAPH LOGIC MEMORY CHANGE");
        }
        DIRTY.set(this, true);
    }

    setAll(values) {
        const debug = DEBUG.get(this);
        if (debug) {
            console.group("GRAPH LOGIC MEMORY CHANGE");
            console.log("changes", values);
        }
        const mem_i = MEM_I.get(this);
        if (values instanceof Map) {
            values.forEach((v, k) => mem_i.set(k, v));
        } else if (typeof values == "object" && !Array.isArray(values)) {
            for (const k in values) {
                const v = values[k];
                mem_i.set(k, v);
            }
        }
        if (debug) {
            console.groupEnd("GRAPH LOGIC MEMORY CHANGE");
        }
        DIRTY.set(this, true);
    }

    get(ref) {
        const mem_o = MEM_O.get(this);
        if (mem_o.has(ref)) {
            return mem_o.get(ref);
        }
        return false;
    }

    getAll() {
        const mem_o = MEM_O.get(this);
        const obj = {};
        mem_o.forEach((v,k) => {obj[k] = v});
        return obj;
    }

    has(ref) {
        const mem_o = MEM_O.get(this);
        if (mem_o.has(ref)) {
            return true;
        }
        return false;
    }

    reset() {
        const mem_i = MEM_I.get(this);
        const mem_o = MEM_O.get(this);
        mem_i.clear();
        mem_o.clear();
        DIRTY.set(this, true);
    }

    isDirty() {
        return DIRTY.get(this);
    }

}