/* LOG LEVEL */
const LOG_LEVEL = Object.freeze({
    TIME: "TIME",
    GROUP: "GROUP",
    ERROR: "ERROR",
    WARN: "WARN",
    INFO: "INFO",
    LOG: "LOG"
});

const TIME_FND = /(....)-(..)-(..)T(..:..:..\....)Z/;
const TIME_REP = "$1-$2-$3 $4";

function formatContent(content) {
    if (typeof content === "object") {
        return JSON.stringify(content);
    }
    return content.toString();
}

function formatMessage(data, groupLevel = 0) {
    const {
        type, time, message, children = []
    } = data;
    const result = [];
    const typeString = type.padEnd(5);
    const timeString = time.toJSON().replace(TIME_FND, TIME_REP);
    const padding = "".padStart(groupLevel * 4);
    result.push(`[${timeString} - ${typeString}] ${padding}${message.map(formatContent).join(" ")}`);
    for (const child of children) {
        result.push(formatMessage(child, groupLevel + 1));
    }
    return result.join("\n");
}

export default class JSONLog {

    #data = [];

    #path = [];

    #timeKeepers = new Map();

    get #needle() {
        if (this.#path.length) {
            return this.#path.at(-1);
        }
        return this.#data;
    }

    error(...message) {
        const time = new Date();
        this.#needle.push({
            type: LOG_LEVEL.ERROR,
            time,
            message
        });
    }

    warn(...message) {
        const time = new Date();
        this.#needle.push({
            type: LOG_LEVEL.WARN,
            time,
            message
        });
    }

    info(...message) {
        const time = new Date();
        this.#needle.push({
            type: LOG_LEVEL.INFO,
            time,
            message
        });
    }

    log(...message) {
        const time = new Date();
        this.#needle.push({
            type: LOG_LEVEL.LOG,
            time,
            message
        });
    }

    time(label = "default") {
        this.#timeKeepers.set(label, performance.now());
    }

    timeLog(label = "default", ...vals) {
        if (this.#timeKeepers.has(label)) {
            const time = new Date();
            const oldPerfTime = this.#timeKeepers.get(label);
            const newPerfTime = performance.now();
            const perfTime = newPerfTime - oldPerfTime;
            this.#needle.push({
                type: LOG_LEVEL.TIME,
                time,
                message: [
                    `${label}: ${perfTime}ms`,
                    ...vals
                ]
            });
        }
    }

    timeEnd(label = "default") {
        if (this.#timeKeepers.has(label)) {
            const time = new Date();
            const oldPerfTime = this.#timeKeepers.get(label);
            const newPerfTime = performance.now();
            const perfTime = newPerfTime - oldPerfTime;
            this.#timeKeepers.delete(label);
            this.#needle.push({
                type: LOG_LEVEL.TIME,
                time,
                message: [
                    `${label}: ${perfTime}ms - timer ended`
                ]
            });
        }
    }

    group(label) {
        const time = new Date();
        const children = [];
        this.#needle.push({
            type: LOG_LEVEL.GROUP,
            time,
            message: [
                label
            ],
            children
        });
        this.#path.push(children);
    }

    groupCollapsed(label) {
        this.group(label);
    }

    groupEnd() {
        this.#path.pop();
    }

    getData() {
        return JSON.parse(JSON.stringify(this.#data));
    }

    getJSON() {
        return JSON.stringify(this.#data);
    }

    getLog() {
        return this.#data.map((entry) => formatMessage(entry)).join("\n");
    }

    clear() {
        this.#data = [];
        this.#path = [];
        this.#timeKeepers.clear();
    }

}
