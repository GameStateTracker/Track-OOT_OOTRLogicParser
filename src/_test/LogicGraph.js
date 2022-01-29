import NodeFactory from "./NodeFactory.js";
import Compiler from "./EdgeLogicCompiler.js";

const MIXINS = new WeakMap();
const MEM_I = new WeakMap();
const NODES = new WeakMap();

export default class LogicGraph {

    constructor() {
        NODES.set(this, new NodeFactory());
        MIXINS.set(this, new Map());
        MEM_I.set(this, new Map());
    }

    clearGraph() {
        const nodeFactory = NODES.get(this);
        nodeFactory.reset();
    }

    load(config) {
        const nodeFactory = NODES.get(this);
        const mixins = MIXINS.get(this);
        for (const name in config.edges) {
            const children = config.edges[name];
            const node = nodeFactory.get(name);
            for (const child in children) {
                const logic = children[child];
                const fn = Compiler.compile(logic);
                node.append(nodeFactory.get(child), fn);
            }
        }
        for (const name in config.logic) {
            const logic = config.logic[name];
            const fn = Compiler.compile(logic);
            mixins.set(name, fn);
        }
    }

    setEdge(source, target, value) {
        const nodeFactory = NODES.get(this);
        const node = nodeFactory.get(source);
        const child = nodeFactory.get(target);
        if (typeof value == "undefined" || value == null) {
            node.remove(child);
        } else {
            const fn = Compiler.compile(value);
            node.append(child, fn);
        }
    }

    setMixin(name, value) {
        const mixins = MIXINS.get(this);
        if (typeof value == "undefined" || value == null) {
            mixins.delete(name);
        } else {
            const fn = Compiler.compile(value);
            mixins.set(name, fn);
        }
    }

    getMixins() {
        const mixins = MIXINS.get(this);
        const res = [];
        for (const [name] of mixins) {
            res.push(name);
        }
        return res;
    }

    getEdges() {
        const nodeFactory = NODES.get(this);
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

    getEdgeInstances() {
        const nodeFactory = NODES.get(this);
        const nodes = nodeFactory.getNames();
        const res = [];
        for (const name of nodes) {
            const node = nodeFactory.get(name);
            const children = node.getTargets();
            for (const ch of children) {
                res.push(node.getEdge(ch));
            }
        }
        return res;
    }

    getTargetNodes() {
        const nodeFactory = NODES.get(this);
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

    /* all mixins */
    executeMixins() {
        const mixins = MIXINS.get(this);
        const allTargets = this.getTargetNodes();
        const traversible = new Set();
        const mem_i = MEM_I.get(this);

        function valueGetter(key) {
            if (allTargets.has(key)) {
                return true; // probably would be better if this never gets called
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

        for (const [name, fn] of mixins) {
            const res = fn(valueGetter, execute);
            if (res) {
                traversible.add(name);
            }
        }

        return traversible;
    }

    /* all edges */
    executeEdges() {
        const allTargets = this.getTargetNodes();
        const reachableNodes = new Set();
        const traversible = new Set();
        const mixins = MIXINS.get(this);
        const mem_i = MEM_I.get(this);
        const queue = this.getEdgeInstances();

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

        let changed = true;
        while (!!queue.length && !!changed) {
            changed = false;
            let counts = queue.length;
            while (counts--) {
                const edge = queue.shift();
                const condition = edge.getCondition();
                const cRes = condition(valueGetter, execute);
                if (cRes) {
                    traversible.add(edge.toString());
                    changed = true;
                    const n = edge.getTarget().getName();
                    if (!reachableNodes.has(n)) {
                        reachableNodes.add(n);
                    }
                } else {
                    queue.push(edge);
                }
            }
        }

        return traversible;
    }

    set(key, value) {
        const mem_i = MEM_I.get(this);
        mem_i.set(key, value);
    }

    setAll(values) {
        const mem_i = MEM_I.get(this);
        if (values instanceof Map) {
            values.forEach((v, k) => mem_i.set(k, v));
        } else if (typeof values == "object" && !Array.isArray(values)) {
            for (const k in values) {
                const v = values[k];
                mem_i.set(k, v);
            }
        }
    }

    reset() {
        const mem_i = MEM_I.get(this);
        mem_i.clear();
    }

}
