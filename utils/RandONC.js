const SPLIT = /(\#.*)?\s*\n\s*/g;

class RandONC {

    parse(input) {
        let buffer = input.replace(SPLIT, " ");
        try {
            return JSON.parse(buffer);
        } catch(e) {
            let pos = parseInt(e.message.slice(e.message.lastIndexOf(" ") + 1));
            let lines = input.split(LNBR_SEQ);
            for(let i = 0; i < lines.length; ++i) {
                let line = lines[i].replace(SPLIT, " ");
                if (line.length > pos) {
                    throw new SyntaxError(`Unexpected token in RandONC at line ${i + 1}: ${line}`);
                } else {
                    pos -= line.length;
                }
            }
        }
    }

}

module.exports = new RandONC();