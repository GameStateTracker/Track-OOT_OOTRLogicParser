import NodeFactory from "./NodeFactory.js";
import Compiler from "./EdgeLogicCompiler.js";

const nodeFactory = new NodeFactory();

function mapToObj(map) {
    let res = {};
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

const TRANSLATION_MATRIX = new WeakMap();

export default class LogicGraph {

    constructor(debug = false) {
        DIRTY.set(this, false);
        MIXINS.set(this, new Map());
        MEM_I.set(this, new Map());
        MEM_O.set(this, new Map());
        TRANSLATION_MATRIX.set(this, new Map());
        DEBUG.set(this, !!debug);
    }

    clearGraph() {
        nodeFactory.reset();
    }

    load(config) {
        let debug = DEBUG.get(this);
        let mixins = MIXINS.get(this);
        let mem_o = MEM_O.get(this);
        if (debug) {
            console.group("GRAPH LOGIC BUILD");
            console.time("build time");
        }
        for (let name in config.edges) {
            let children = config.edges[name];
            let node = nodeFactory.get(name);
            for (let child in children) {
                let logic = children[child];
                let fn = Compiler.compile(logic);
                node.append(nodeFactory.get(child), fn);
                if (!mem_o.has(child)) {
                    mem_o.set(child, false);
                }
            }
        }
        for (let name in config.logic) {
            let logic = config.logic[name];
            let fn = Compiler.compile(logic);
            mixins.set(name, fn);
        }
        if (debug) {
            console.timeEnd("build time");
            console.groupEnd("GRAPH LOGIC BUILD");
        }
        DIRTY.set(this, true);
    }

    setEdge(source, target, value) {
        let debug = DEBUG.get(this);
        if (debug) {
            console.group("GRAPH LOGIC BUILD");
            console.time("build time");
        }
        let node = nodeFactory.get(source);
        let child = nodeFactory.get(target);
        if (typeof value == "undefined" || value == null) {
            node.remove(child);
            DIRTY.set(this, true);
        } else {
            let fn = Compiler.compile(value);
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
        let debug = DEBUG.get(this);
        let mixins = MIXINS.get(this);
        if (debug) {
            console.group("GRAPH LOGIC BUILD");
            console.time("build time");
        }
        if (typeof value == "undefined" || value == null) {
            mixins.delete(name);
            DIRTY.set(this, true);
        } else {
            let fn = Compiler.compile(value);
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

    setTranslation(source, target, reroute) {
        let translationMatrix = TRANSLATION_MATRIX.get(this);
        if (!reroute) {
            translationMatrix.delete(`${source} => ${target}`);
        } else {
            translationMatrix.set(`${source} => ${target}`, reroute);
        }
    }

    getTranslation(source, target) {
        let translationMatrix = TRANSLATION_MATRIX.get(this);
        if (translationMatrix.has(`${source} => ${target}`)) {
            return translationMatrix.get(`${source} => ${target}`);
        }
        return target;
    }

    getEdges() {
        let nodes = nodeFactory.getNames();
        let res = [];
        for (let name of nodes) {
            let node = nodeFactory.get(name);
            let children = node.getTargets();
            for (let ch of children) {
                res.push([name, ch]);
            }
        }
        return res;
    }

    getTargetNodes() {
        let nodes = nodeFactory.getNames();
        let res = new Set();
        for (let name of nodes) {
            let node = nodeFactory.get(name);
            let children = node.getTargets();
            for (let ch of children) {
                res.add(ch);
            }
        }
        return res;
    }

    /* broad search */
    traverse(startNode) {
        let allTargets = this.getTargetNodes();
        let reachableNodes = new Set();
        let changes = {};
        let mixins = MIXINS.get(this);
        let mem_o = MEM_O.get(this);
        let mem_i = MEM_I.get(this);
        let debug = DEBUG.get(this);
        let start = nodeFactory.get(startNode);
        if (start != null) {
            if (debug) {
                console.group("GRAPH LOGIC EXECUTION");
                console.log("input", mapToObj(mem_i));
                console.log("traverse nodes...");
                console.time("execution time");
            }

            function valueGetter(key) {
                if (allTargets.has(key)) {
                    return +reachableNodes.has(key);
                } else if (mem_i.has(key)) {
                    return mem_i.get(key);
                }
            }

            function execute(name) {
                if (mixins.has(name)) {
                    let fn = mixins.get(name);
                    let res = fn(valueGetter, execute);
                    /*if (debug) {
                        console.groupCollapsed(`execute mixin [${name}]`);
                        console.log(fn.toString());
                        console.log(`result: ${res}`);
                        console.groupEnd(`execute mixin [${name}]`);
                    }*/
                    return res;
                }
                return 0;
            }

            let queue = [];
            for (let ch of start.getTargets()) {
                let edge = start.getEdge(ch);
                queue.push(edge);
            }
            let changed = true;
            while(!!queue.length && !!changed) {
                changed = false;
                let counts = queue.length;
                while (!!counts--) {
                    let edge = queue.shift();
                    let condition = edge.getCondition();
                    let cRes = condition(valueGetter, execute);
                    /*if (debug) {
                        console.groupCollapsed(`traverse edge [${edge}]`);
                        console.log(condition.toString());
                        console.log(`result: ${cRes}`);
                        console.groupEnd(`traverse edge [${edge}]`);
                    }*/
                    if (cRes) {
                        changed = true;
                        let n = this.getTranslation(edge.getSource().getName(), edge.getTarget().getName());
                        let node = nodeFactory.get(n);
                        if(!reachableNodes.has(n)) {
                            reachableNodes.add(n);
                            let targets = node.getTargets();
                            for (let ch of targets) {
                                let edge = node.getEdge(ch);
                                queue.push(edge);
                            }
                        }
                    } else {
                        queue.push(edge);
                    }
                }
            }
            DIRTY.set(this, false);
            for (let ch of allTargets) {
                let v = reachableNodes.has(ch);
                if (mem_o.get(ch) != v) {
                    mem_o.set(ch, v);
                    changes[ch] = v;
                }
            }
            if (debug) {
                console.log("success");
                console.timeEnd("execution time");
                console.log("output", mapToObj(mem_o));
                console.log("changes", changes);
                console.groupEnd("GRAPH LOGIC EXECUTION");
            }
        }
        return changes;
    }

    set(key, value) {
        let debug = DEBUG.get(this);
        if (debug) {
            console.group("GRAPH LOGIC MEMORY CHANGE");
            console.log("change", `${key} => ${value}`);
        }
        let mem_i = MEM_I.get(this);
        mem_i.set(key, value);
        if (debug) {
            console.groupEnd("GRAPH LOGIC MEMORY CHANGE");
        }
        DIRTY.set(this, true);
    }

    setAll(values) {
        let debug = DEBUG.get(this);
        if (debug) {
            console.group("GRAPH LOGIC MEMORY CHANGE");
            console.log("changes", values);
        }
        let mem_i = MEM_I.get(this);
        if (values instanceof Map) {
            values.forEach((v, k) => mem_i.set(k, v));
        } else if (typeof values == "object" && !Array.isArray(values)) {
            for (let k in values) {
                let v = values[k];
                mem_i.set(k, v);
            }
        }
        if (debug) {
            console.groupEnd("GRAPH LOGIC MEMORY CHANGE");
        }
        DIRTY.set(this, true);
    }

    get(ref) {
        let mem_o = MEM_O.get(this);
        if (mem_o.has(ref)) {
            return mem_o.get(ref);
        }
        return false;
    }

    getAll() {
        let mem_o = MEM_O.get(this);
        let obj = {};
        mem_o.forEach((v,k) => {obj[k] = v});
        return obj;
    }

    has(ref) {
        let mem_o = MEM_O.get(this);
        if (mem_o.has(ref)) {
            return true;
        }
        return false;
    }

    reset() {
        let mem_i = MEM_I.get(this);
        let mem_o = MEM_O.get(this);
        mem_i.clear();
        mem_o.clear();
        DIRTY.set(this, true);
    }

    isDirty() {
        return DIRTY.get(this);
    }

}