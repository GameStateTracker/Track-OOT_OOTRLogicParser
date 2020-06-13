// structure
const AMOUNT = /(.*?)(?:\()([^,()]+),\s*([^,()]+)(?:\))(.*)/;
const FUNCTIONS = /(.*?)([^()\s]+)\(([^()]+)\)(.*)/;
const BRACKETS = /(.*?)(?:\()([^,()]+)(?:\))(.*)/;
// operators
const NOT = /(.*?)(?:not ([^,()\s]+|'[^']+'))(.*)/;
const COMPARATOR = /(.*?)([^\s]+)\s*((?:!|>|<|=)?=|<|>)\s*([^\s]+|'[^']+')(.*?)/;
const VALUE = /[^\s]+|'[^']+'/;
const LITERAL = /%[0-9]+%/;

let count = 0;

class RandTokenizer {

    tokenize(term, tokens = []) {
        count = 0;
        tokens[0] = generate(term.trim(), tokens);
        return tokens;
    }

}

function generate(term, tokens) {
    let buf = null;
    if(!!(buf = FUNCTIONS.exec(term))) {
        // parse function calls
        let cnt = ++count;
        tokens[cnt] = `${buf[2]}(${params(buf[3].trim(), tokens)})`;
        return generate(`${buf[1]}%${cnt}%${buf[4]}`, tokens);
    } else if(!!(buf = AMOUNT.exec(term))) {
        // parse amount syntax (why ever you would write it that way...)
        let cnt0 = ++count;
        let cnt1 = ++count;
        tokens[cnt1] = buf[2];
        tokens[cnt0] = `min(%${cnt1}%, ${buf[3]})`;
        return generate(`${buf[1]}%${cnt0}%${buf[4]}`, tokens);
    } else if(!!(buf = BRACKETS.exec(term))) {
        // parse normal brackets
        let cnt = ++count;
        tokens[cnt] = convert(buf[2].trim(), tokens);
        return generate(`${buf[1]}%${cnt}%${buf[3]}`, tokens);
    } else {
        return convert(term, tokens);
    }
}

function params(term, tokens) {
    return term.split(",").map(el => {
        let cnt = ++count;
        tokens[cnt] = generate(el.trim(), tokens);
        return `%${cnt}%`;
    }).join(", ");
}

function convert(term, tokens) {
    if (term.indexOf(" or ") >= 0) {
        return term.split(" or ").map(t => {
            if (!t.match(LITERAL)) {
                let cnt = ++count;
                tokens[cnt] = convert(t, tokens);
                return `%${cnt}%`;
            }
            return t;
        }).join(" or ");
    }
    if (term.indexOf(" and ") >= 0) {
        return term.split(" and ").map(t => {
            if (!t.match(LITERAL)) {
                let cnt = ++count;
                tokens[cnt] = convert(t, tokens);
                return `%${cnt}%`;
            }
            return t;
        }).join(" and ");
    }
    let buf = null;
    if(!!(buf = NOT.exec(term))) {
        let cnt0 = ++count;
        if (buf[1] == "" && buf[3] == "") {
            tokens[cnt0] = convert(buf[2], tokens);
            return `not %${cnt0}%`;
        } else {
            let cnt1 = ++count;
            tokens[cnt0] = `not %${cnt1}%`;
            tokens[cnt1] = convert(buf[2], tokens);
            return `${buf[1]}%${cnt0}%${buf[3]}`;
        }
    }
    if(!!(buf = COMPARATOR.exec(term))) {
        let cnt0 = ++count;
        let cnt1 = ++count;
        if (buf[1] == "" && buf[5] == "") {
            tokens[cnt0] = convert(buf[2], tokens);
            tokens[cnt1] = convert(buf[4], tokens);
            return `%${cnt0}% ${buf[3]} %${cnt1}%`;
        } else {
            let cnt2 = ++count;
            tokens[cnt0] = `%${cnt1}% ${buf[3]} %${cnt2}%`;
            tokens[cnt1] = convert(buf[2], tokens);
            tokens[cnt2] = convert(buf[4], tokens);
            return `${buf[1]}%${cnt0}%${buf[5]}`;
        }
    }
    if (!term.match(VALUE)) {
        throw new Error(`something went wrong at tokenizing term\n${term}\n---`);
    }
    return term;
}

export default new RandTokenizer();