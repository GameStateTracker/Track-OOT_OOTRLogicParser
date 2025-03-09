
function filterNull(input) {
    return input != null;
}

function filterTrue(input) {
    return input.type != "true";
}

function filterFalse(input) {
    return input.type != "false";
}

function logicReducer(input) {
    switch (input?.type) {
        case "and": {
            const output = {
                type: input.type,
                content: input.content.map(logicReducer).filter(filterNull).filter(filterTrue)
            };
            if (output.content.length == 0) {
                return;
            }
            if (output.content.length == 1) {
                return output.content[0];
            }
            if (output.content.some((e) => e.type == "false")) {
                return {
                    type: "false"
                };
            }
            return output;
        }
        case "nand": {
            const output = {
                type: input.type,
                content: input.content.map(logicReducer).filter(filterNull).filter(filterTrue)
            };
            if (output.content.length == 0) {
                return;
            }
            if (output.content.length == 1) {
                return output.content[0];
            }
            if (output.content.some((e) => e.type == "false")) {
                return {
                    type: "true"
                };
            }
            return output;
        }
        case "or": {
            const output = {
                type: input.type,
                content: input.content.map(logicReducer).filter(filterNull).filter(filterFalse)
            };
            if (output.content.length == 0) {
                return;
            }
            if (output.content.length == 1) {
                return output.content[0];
            }
            if (output.content.some((e) => e.type == "true")) {
                return {
                    type: "true"
                };
            }
            return output;
        }
        case "nor": {
            const output = {
                type: input.type,
                content: input.content.map(logicReducer).filter(filterNull).filter(filterFalse)
            };
            if (output.content.length == 0) {
                return;
            }
            if (output.content.length == 1) {
                return output.content[0];
            }
            if (output.content.some((e) => e.type == "true")) {
                return {
                    type: "false"
                };
            }
            return output;
        }
        case "xor": {
            const output = {
                type: input.type,
                content: input.content.map(logicReducer).filter(filterNull)
            };
            if (output.content.length == 0) {
                return;
            }
            if (output.content.length == 1) {
                return output.content[0];
            }
            if (output.content[0].type == "true" && output.content[1].type == "true" || output.content[0].type == "false" && output.content[1].type == "false") {
                return {
                    type: "false"
                };
            }
            if (output.content[0].type == "false" && output.content[1].type == "true" || output.content[0].type == "true" && output.content[1].type == "false") {
                return {
                    type: "true"
                };
            }
            return output;
        }
        case "xnor": {
            const output = {
                type: input.type,
                content: input.content.map(logicReducer).filter(filterNull)
            };
            if (output.content.length == 0) {
                return;
            }
            if (output.content.length == 1) {
                return output.content[0];
            }
            if (output.content[0].type == "true" && output.content[1].type == "true" || output.content[0].type == "false" && output.content[1].type == "false") {
                return {
                    type: "true"
                };
            }
            if (output.content[0].type == "false" && output.content[1].type == "true" || output.content[0].type == "true" && output.content[1].type == "false") {
                return {
                    type: "false"
                };
            }
            return output;
        }
        case "add":
        case "sub":
        case "mul":
        case "div":
        case "mod":
        case "pow":
        case "eq":
        case "neq":
        case "gt":
        case "gte":
        case "lt":
        case "lte": {
            const output = {
                type: input.type,
                content: input.content.map(logicReducer).filter(filterNull)
            };
            if (output.content.length == 0) {
                return;
            }
            if (output.content.length == 1) {
                return output.content[0];
            }
            return output;
        }
        case "min":
        case "max": {
            const output = {
                type: input.type,
                content: logicReducer(input.content),
                value: input.value
            };
            if (output.content == null) {
                return;
            }
            return output;
        }
        case "not": {
            const output = {
                "type": "not",
                "content": logicReducer(input.content)
            };
            if (output.content == null) {
                return;
            }
            if (output.content.type == "false") {
                return {
                    type: "true"
                };
            }
            if (output.content.type == "true") {
                return {
                    type: "false"
                };
            }
            if (output.content.type == "not") {
                return output.content.content;
            }
            return output;
        }
        default: {
            return input;
        }
    }
}

export function reduceLogic(config) {
    const res = {
        version: config.version,
        edges: {},
        functions: {}
    };

    for (const s in config.edges) {
        res.edges[s] = res.edges[s] ?? {};
        const targets = config.edges[s];
        for (const t in targets) {
            const {
                logic, dataMutation
            } = targets[t];
            try {
                const reducedLogic = logicReducer(logic);
                if (reducedLogic != null) {
                    res.edges[s][t] = {
                        logic: reducedLogic,
                        dataMutation
                    };
                } else {
                    res.edges[s][t] = {
                        logic: {
                            type: "false"
                        },
                        dataMutation
                    };
                }
            } catch (err) {
                console.error(`Error in edge "${s}" -> "${t}"`, err);
                console.error("---\n", JSON.stringify(logic, null, 4), "\n---");
            }
        }
    }
    for (const n in config.functions) {
        const {
            params, logic
        } = config.functions[n];
        try {
            const reducedLogic = logicReducer(logic);
            if (reducedLogic != null) {
                res.functions[n] = {
                    params,
                    logic: reducedLogic
                };
            } else {
                res.functions[n] = {
                    params,
                    logic: {
                        type: "false"
                    }
                };
            }
        } catch (err) {
            console.error(`Error in mixin "${n}"`, err);
            console.error("---\n", JSON.stringify(logic, null, 4), "\n---");
        }
    }

    return res;
}
