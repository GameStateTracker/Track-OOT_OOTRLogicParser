// structure
const AMOUNT = /(.*?)(?:\()([^,()]+),\s*([0-9]+)(?:\))(.*)/;
const FUNCTIONS = /(.*?)([^()\s]+)\(([^()]+)\)(.*)/;
const BRACKETS = /(.*?)(?:\()([^,()]+)(?:\))(.*)/;
// operators
const NOT = /(.*?)(?:not ([^,()\s]+))(.*)/;
const COMPARATOR = /(.*?)([^\s]+)\s*((?:!|>|<)?=|<|>)\s*([^\s]+)(.*?)/;
const COMBINATOR = /(.*?)(and|or)(.*?)/

export default class RandTokenizer {

    private static count: number = 0;

    private constructor() { }

    public static tokenize(term: string, tokens: string[] = []): string[] {
        RandTokenizer.count = 0;
        tokens[0] = RandTokenizer.generate(term.trim(), tokens);
        return tokens;
    }

    private static generate(term: string, tokens: string[]): string {
        let buf = null;
	    if(!!(buf = AMOUNT.exec(term))) {
            // parse amount syntax (why ever you would write it that way...)
            let cnt0 = ++RandTokenizer.count;
            let cnt1 = ++RandTokenizer.count;
            tokens[cnt1] = buf[2];
			tokens[cnt0] = `min(%${cnt1}%, ${buf[3]})`;
            return RandTokenizer.generate(`${buf[1]}%${cnt0}%${buf[4]}`, tokens);
        } else if(!!(buf = FUNCTIONS.exec(term))) {
            // parse function calls
            let cnt = ++RandTokenizer.count;
			tokens[cnt] = `${buf[2]}(${RandTokenizer.params(buf[3].trim(), tokens)})`;
            return RandTokenizer.generate(`${buf[1]}%${cnt}%${buf[4]}`, tokens);
        } else if(!!(buf = BRACKETS.exec(term))) {
            // parse normal brackets
            let cnt = ++RandTokenizer.count;
			tokens[cnt] = RandTokenizer.convert(buf[2].trim(), tokens);
            return RandTokenizer.generate(`${buf[1]}%${cnt}%${buf[3]}`, tokens);
        } else {
			return RandTokenizer.convert(term, tokens);
        }
    }

    private static params(term: string, tokens: string[]): string {
        return term.split(",").map(el => {
            let cnt = ++RandTokenizer.count;
			tokens[cnt] = RandTokenizer.generate(el.trim(), tokens);
            return `%${cnt}%`;
        }).join(", ");
    }

    private static convert(term: string, tokens: string[]): string {
        let buf = null;
        if(!!(buf = NOT.exec(term))) {
            let cnt0 = ++RandTokenizer.count;
            if (buf[1] == "" && buf[3] == "") {
                tokens[cnt0] = buf[2];
                term = `not %${cnt0}%`;
            } else {
                let cnt1 = ++RandTokenizer.count;
                tokens[cnt0] = `not %${cnt1}%`;
                tokens[cnt1] = buf[2];
                term = `${buf[1]}%${cnt0}%${buf[3]}`;
            }
        }
        if(!!(buf = COMPARATOR.exec(term))) {
            let cnt0 = ++RandTokenizer.count;
            let cnt1 = ++RandTokenizer.count;
            if (buf[1] == "" && buf[5] == "") {
                tokens[cnt0] = buf[2];
                tokens[cnt1] = buf[4];
                term = `%${cnt0}% ${buf[3]} %${cnt1}%`;
            } else {
                let cnt2 = ++RandTokenizer.count;
                tokens[cnt0] = `%${cnt1}% ${buf[3]} %${cnt2}%`;
                tokens[cnt1] = buf[2];
                tokens[cnt2] = buf[4];
                term = `${buf[1]}%${cnt0}%${buf[5]}`;
            }
        }
        if (term.indexOf(" ") < 0) {
            return term;
        }
        return term.split(" or ").map(term => {
            if (term.indexOf(" ") < 0) {
                if (!term.startsWith("%")) {
                    let cnt = ++RandTokenizer.count;
                    tokens[cnt] = term;
                    return `%${cnt}%`;
                }
                return term;
            }
            return term.split(" and ").map(term => {
                if (term.indexOf(" ") < 0) {
                    if (!term.startsWith("%")) {
                        let cnt = ++RandTokenizer.count;
                        tokens[cnt] = term;
                        return `%${cnt}%`;
                    }
                    return term;
                }
                return term;
            }).join(" and ");
        }).join(" or ");
    }

}