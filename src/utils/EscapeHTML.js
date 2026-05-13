const ESCAPES = {
    "&": "&#x26;",
    "<": "&#x3C;",
    ">": "&#x3E;",
    "\"": "&#x22;",
    "'": "&#x27;",
    "/": "&#x2F;"
};
const ESCAPER = /[&<>"'/]/g;

export function escapeHTML(string) {
    return ("" + string).replace(ESCAPER, function(match) {
        return ESCAPES[match];
    });
}

;
