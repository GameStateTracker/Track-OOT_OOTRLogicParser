function isClass(clazz = Object) {
    if (clazz == null) {
        return false;
    }
    const isClass = isClassDefinition(clazz);
    if (clazz.prototype == null) {
        return isClass;
    }
    const isProtoClass = isClassDefinition(clazz.prototype);
    return isClass || isProtoClass;
}

function isClassDefinition(clazz) {
    return clazz.constructor?.toString().slice(0, 5) === "class";
}

/* LOG LEVEL */
export const LOG_LEVEL = Object.freeze({
    SYSTEM: "SYSTEM",
    ERROR: "ERROR",
    WARN: "WARN",
    INFO: "INFO",
    LOG: "LOG"
});

const TIME_FND = /(....)-(..)-(..)T(..:..:..\....)Z/;
const TIME_REP = "$1-$2-$3 $4";

let globalOmitStack = true;

function formatMessage(data, omitStack) {
    const {
        type, time, target, message
    } = data;
    const typeString = type.padEnd(5);
    const targetString = typeof target === "string" && target !== "" ? target : "∅";
    if (message instanceof Error) {
        const msg = formatError(message, omitStack);
        return `[${time} - ${typeString}] ${targetString} • ${msg}`;
    } else {
        return `[${time} - ${typeString}] ${targetString} • ${message}`;
    }
}

function formatError(err, omitStack) {
    const msg = err.message;
    const stack = err.stack.split("\n").slice(1).join("\n");
    const cause = err.cause;
    const result = [msg];
    if ((omitStack != null && !omitStack) || !globalOmitStack) {
        result.push(stack);
    }
    if (cause != null) {
        if (Array.isArray(cause)) {
            result.push(`    ↳ ${cause.map((c) => {
                return formatError(c, omitStack).split("\n").map((l) => `    ${l}`).join("\n").slice(4);
            }).join("\n    ↳ ")}`);
        } else {
            result.push(`    ↳ ${formatError(cause, omitStack).split("\n").map((l) => `    ${l}`).join("\n").slice(4)}`);
        }
    }
    return result.join("\n");
}

const timeKeepers = new Map();

function setTimeKeeper(target, name, value) {
    if (!timeKeepers.has(target)) {
        timeKeepers.set(target, new Map());
    }
    const timeKeeper = timeKeepers.get(target);
    timeKeeper.set(name, value);
}

function getTimeKeeper(target, name) {
    return timeKeepers.get(target)?.get(name);
}

const groups = new Map();

function pushGroup(target, name) {
    if (!groups.has(target)) {
        groups.set(target, []);
    }
    const group = groups.get(target);
    group.push(name);
}

function popGroup(target) {
    return groups.get(target)?.pop();
}

function getGroupDepth(target) {
    return groups.get(target)?.length ?? 0;
}

export default class Logger {

    static #instances = new Map();

    #clazzName = "";

    #omitStack = true;

    constructor(clazz) {
        if (clazz != null) {
            if (clazz == null || !isClass(clazz)) {
                throw new Error("can only construct Logger for classes");
            }
        }
        if (Logger.#instances.has(clazz)) {
            return Logger.#instances.get(clazz);
        }
        this.#clazzName = clazz.name;
    }

    set omitStack(value) {
        this.#omitStack = !!value;
    }

    get omitStack() {
        return this.#omitStack;
    }

    error(message) {
        Logger.error(message, this.#clazzName, {omitStack: this.#omitStack});
    }

    warn(message) {
        Logger.warn(message, this.#clazzName, {omitStack: this.#omitStack});
    }

    info(message) {
        Logger.info(message, this.#clazzName, {omitStack: this.#omitStack});
    }

    log(message) {
        Logger.log(message, this.#clazzName, {omitStack: this.#omitStack});
    }

    message(type, message) {
        Logger.message(type, message, this.#clazzName, {omitStack: this.#omitStack});
    }

    time(name) {
        Logger.time(name, this.#clazzName);
    }

    timeEnd(name) {
        Logger.timeEnd(name, this.#clazzName);
    }

    group(name) {
        Logger.group(name, this.#clazzName);
    }

    groupCollapsed(name) {
        Logger.groupCollapsed(name, this.#clazzName);
    }

    groupEnd() {
        Logger.groupEnd(this.#clazzName);
    }

    static #write(data, omitStack) {
        console.log(formatMessage(data, omitStack));
    }

    static error(message, target = null, params = {}) {
        const {
            omitStack = undefined, time = new Date()
        } = params;
        this.#write({
            target: target,
            type: LOG_LEVEL.ERROR,
            time: time.toJSON().replace(TIME_FND, TIME_REP),
            message: message
        }, omitStack);
    }

    static warn(message, target = null, params = {}) {
        const {
            omitStack = undefined, time = new Date()
        } = params;
        this.#write({
            target: target,
            type: LOG_LEVEL.WARN,
            time: time.toJSON().replace(TIME_FND, TIME_REP),
            message: message
        }, omitStack);
    }

    static info(message, target = null, params = {}) {
        const {
            omitStack = undefined, time = new Date()
        } = params;
        this.#write({
            target: target,
            type: LOG_LEVEL.INFO,
            time: time.toJSON().replace(TIME_FND, TIME_REP),
            message: message
        }, omitStack);
    }

    static log(message, target = null, params = {}) {
        const {
            omitStack = undefined, time = new Date()
        } = params;
        this.#write({
            target: target,
            type: LOG_LEVEL.LOG,
            time: time.toJSON().replace(TIME_FND, TIME_REP),
            message: message
        }, omitStack);
    }

    static message(type, message, target = null, params = {}) {
        const {
            omitStack = undefined, time = new Date()
        } = params;
        this.#write({
            target: target,
            type: type,
            time: time.toJSON().replace(TIME_FND, TIME_REP),
            message: message
        }, omitStack);
    }

    static time(name, target = null) {
        setTimeKeeper(target, name, performance.now());
    }

    static timeEnd(name, target = null) {
        const time = new Date();
        const oldPerfTime = getTimeKeeper(target, name);
        const newPerfTime = performance.now();
        const perfTime = newPerfTime - oldPerfTime;
        this.#write({
            target: target,
            type: LOG_LEVEL.SYSTEM,
            time: time.toJSON().replace(TIME_FND, TIME_REP),
            message: `${name}: ${perfTime} ms`
        });
    }

    static group(name, target = null) {
        const time = new Date();
        pushGroup(target, name);
        this.#write({
            target: target,
            type: LOG_LEVEL.SYSTEM,
            time: time.toJSON().replace(TIME_FND, TIME_REP),
            message: `>> [${getGroupDepth(target)}] >> ${name}`
        });
    }

    static groupCollapsed(name, target = null) {
        this.group(name, target);
    }

    static groupEnd(target = null) {
        const time = new Date();
        const name = popGroup(target);
        this.#write({
            target: target,
            type: LOG_LEVEL.SYSTEM,
            time: time.toJSON().replace(TIME_FND, TIME_REP),
            message: `<< [${getGroupDepth(target)}] << ${name}`
        });
    }

    static set omitStack(value) {
        globalOmitStack = !!value;
    }

    static get omitStack() {
        return globalOmitStack;
    }

}
