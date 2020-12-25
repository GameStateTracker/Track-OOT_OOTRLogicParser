function recursion(obj, mixins) {

    Object.keys(obj).forEach(key => {
        if(mixins.has(obj[key].el)){
            delete obj[key]
        }

        if(obj[key] && Array.isArray(obj[key].el)) {
            obj[key].el = obj[key].el.filter(value => Object.keys(value).length > 0)
        }

        if(obj[key] && obj[key].type === 'or' && obj[key].el.length === 1) {
            obj[key] = obj[key].el[0]
        }

        if (obj[key] && typeof obj[key] === "object") {
            obj[key] = recursion(obj[key], mixins);
        } else if (obj[key] != null) {
            obj[key] = obj[key];
        }
    })

    return obj;
}


export function filterFailedMixins(data) {
    let [logic, mixins] = data;
    let res = logic;

    res.edges = recursion(logic.edges, mixins)
    res.edges = recursion(logic.edges, mixins)
    res.edges = recursion(logic.edges, mixins)

    return res
}