// structure
const GTE = /(.*?)(?:\()([^,()]+),\s*([^,()]+)(?:\))(.*)/;
const MIN = /(.*?)(?:\()([^,()]+),\s*([0-9]+)(?:\))(.*)/;
const FUNCTIONS = /(.*?)([^()\s]+)\(([^()]+)\)(.*)/;
const BRACKETS = /(.*?)(?:\()([^,()]+)(?:\))(.*)/;
// operators
const NOT = /(.*?)(?:not ([^,()\s]+|'[^']+'))(.*)/;
const COMPARATOR = /(.*?)([^\s]+)\s*((?:!|>|<|=)?=|<|>)\s*([^\s]+|'[^']+')(.*?)/;
const VALUE = /[^\s]+|'[^']+'/;
const LITERAL = /\{\{[0-9]+\}\}/;

let count = 0;

class RandTokenizer {

    tokenize(term, token = []) {
        count = 0;
        token[0] = generate(term.trim(), token);
        return token;
    }

}

function generate(term, token) {
    let buf = FUNCTIONS.exec(term);
    if (buf != null) {
        // parse function calls
        const cnt = ++count;
        token[cnt] = `${buf[2]}(${params(buf[3].trim(), token)})`;
        return generate(`${buf[1]}{{${cnt}}}${buf[4]}`, token);
    }
    buf = MIN.exec(term);
    if (buf != null) {
        // parse min syntax (why ever you would write it that way...)
        const cnt0 = ++count;
        const cnt1 = ++count;
        token[cnt0] = `min({{${cnt1}}}, buf[3])`;
        token[cnt1] = buf[2];
        return generate(`${buf[1]}{{${cnt0}}}${buf[4]}`, token);
    }
    buf = GTE.exec(term);
    if (buf != null) {
        // parse gte syntax (why ever you would write it that way...)
        const cnt0 = ++count;
        const cnt1 = ++count;
        const cnt2 = ++count;
        token[cnt0] = `gte({{${cnt1}}}, {{${cnt2}}})`;
        token[cnt1] = buf[2];
        token[cnt2] = buf[3];
        return generate(`${buf[1]}{{${cnt0}}}${buf[4]}`, token);
    }
    buf = BRACKETS.exec(term);
    if (buf != null) {
        // parse normal brackets
        const cnt = ++count;
        token[cnt] = convert(buf[2].trim(), token);
        return generate(`${buf[1]}{{${cnt}}}${buf[3]}`, token);
    }
    return convert(term, token);
}

function params(term, token) {
    return term.split(",").map(el => {
        const cnt = ++count;
        token[cnt] = generate(el.trim(), token);
        return `{{${cnt}}}`;
    }).join(", ");
}

function convert(term, token) {
    if (term.indexOf(" or ") >= 0) {
        return term.split(" or ").map(t => {
            if (!t.match(LITERAL)) {
                const cnt = ++count;
                token[cnt] = convert(t, token);
                return `{{${cnt}}}`;
            }
            return t;
        }).join(" or ");
    }
    if (term.indexOf(" and ") >= 0) {
        return term.split(" and ").map(t => {
            if (!t.match(LITERAL)) {
                const cnt = ++count;
                token[cnt] = convert(t, token);
                return `{{${cnt}}}`;
            }
            return t;
        }).join(" and ");
    }
    let buf = NOT.exec(term);
    if (buf != null) {
        const cnt0 = ++count;
        if (buf[1] == "" && buf[3] == "") {
            token[cnt0] = convert(buf[2], token);
            return `not {{${cnt0}}}`;
        } else {
            const cnt1 = ++count;
            token[cnt0] = `not {{${cnt1}}}`;
            token[cnt1] = convert(buf[2], token);
            return `${buf[1]}{{${cnt0}}}${buf[3]}`;
        }
    }
    buf = COMPARATOR.exec(term)
    if (buf != null) {
        const cnt0 = ++count;
        const cnt1 = ++count;
        if (buf[1] == "" && buf[5] == "") {
            token[cnt0] = convert(buf[2], token);
            token[cnt1] = convert(buf[4], token);
            return `{{${cnt0}}} ${buf[3]} {{${cnt1}}}`;
        } else {
            const cnt2 = ++count;
            token[cnt0] = `{{${cnt1}}} ${buf[3]} {{${cnt2}}}`;
            token[cnt1] = convert(buf[2], token);
            token[cnt2] = convert(buf[4], token);
            return `${buf[1]}{{${cnt0}}}${buf[5]}`;
        }
    }
    if (!term.match(VALUE)) {
        throw new Error(`something went wrong at tokenizing term\n${term}\n---`);
    }
    return term;
}

export default new RandTokenizer();
