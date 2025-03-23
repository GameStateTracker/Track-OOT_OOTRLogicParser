
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
    return {
        _version: config._version,
        graph: reduceGraph(config.graph),
        functions: reduceFunctions(config.functions)
    };
}

function reduceGraph(config) {
    const res = {};
    for (const sourceName in config) {
        const edgeConfig = config[sourceName];
        const {
            dataMutation, edges = edgeConfig
        } = edgeConfig;
        res[sourceName] = res[sourceName] ?? {
            dataMutation: dataMutation ?? {},
            edges: {}
        };
        for (const targetName in edges) {
            const targetEdge = edges[targetName];
            const {
                dataMutation, logic = targetEdge
            } = targetEdge;
            try {
                res[sourceName].edges[targetName] = {
                    dataMutation: dataMutation ?? {},
                    logic: logicReducer(logic) ?? {
                        type: "false"
                    }
                };
            } catch (err) {
                console.error(`Error in edge "${sourceName}" -> "${targetName}"`, err);
            }
        }
    }
    return res;
}

function reduceFunctions(functions) {
    const res = {};
    for (const name in functions) {
        const func = functions[name];
        const {
            params, logic = func
        } = func;
        try {
            res.functions[name] = {
                params: params ?? [],
                logic: logicReducer(logic) ?? {
                    type: "false"
                }
            };
        } catch (err) {
            console.error(`Error in function "${name}"`, err);
        }
    }
    return res;
}
