function deleteBadMixins(obj, mixins) {
    Object.keys(obj).forEach((key) => {
        if (obj[key] == null) {
            console.warn(`nullsy value detected for key ${key}`);
            delete obj[key];
        } else if (mixins.has(obj[key].content)) {
            delete obj[key];
        }
        if (obj[key] && typeof obj[key] === "object") {
            obj[key] = deleteBadMixins(obj[key], mixins);
        } else if (obj[key] != null) {
            // obj[key] = obj[key];
        }
    });

    return obj;
}

function reduceArraySize(obj, and = false) {
    Object.keys(obj).forEach((key) => {
        if (obj[key] && Array.isArray(obj[key].content)) {
            const length = obj[key].content.length;
            obj[key].content = obj[key].content.filter((value) => Object.keys(value).length > 0);
            // if(obj[key].type === 'and') console.log(obj[key].content.length + ":::::" + length)
            if (obj[key].type === "and" && obj[key].content.length != length && and) {
                delete obj[key];
                //Use this if deleting the and statements causes issues
                // obj[key] = {type: "false"};
            }
        }

        if (obj[key] && typeof obj[key] === "object") {
            obj[key] = reduceArraySize(obj[key], and);
        } else if (obj[key] != null) {
            // obj[key] = obj[key];
        }
    });

    return obj;
}

function orSimplifier(obj) {
    Object.keys(obj).forEach((key) => {
        if (obj[key] && obj[key].type === "or" && obj[key].content.length === 1) {
            obj[key] = obj[key].content[0];
        }
        if (obj[key] && typeof obj[key] === "object") {
            obj[key] = orSimplifier(obj[key]);
        } else if (obj[key] != null) {
            // obj[key] = obj[key];
        }
    });

    return obj;
}

function emptyAtLogic(obj) {
    Object.keys(obj).forEach((key) => {
        if (obj[key].type === "at" && (obj[key].content === null || obj[key].content === undefined)) {
            obj[key] = {type: "false"};
            //delete obj[key];
        }
        if (obj[key] && typeof obj[key] === "object") {
            obj[key] = emptyAtLogic(obj[key]);
        } else if (obj[key] != null) {
            // obj[key] = obj[key];
        }
    });

    return obj;
}

export function filterFailedMixins(data) {
    const [logic, mixins] = data;
    let res = logic;

    res = deleteBadMixins(logic, mixins);
    res = reduceArraySize(logic, true);
    res = emptyAtLogic(logic);
    res = reduceArraySize(logic);
    res = orSimplifier(logic);
    res = reduceArraySize(logic);
    res = emptyAtLogic(logic);

    return res;
}
