const LNBR_SEQ = /(?:\r\n|\n|\r)/g;
const SPLIT = /(\#.*)?\s*\n\s*/g;

export default class RandONC {

    private constructor() { }

    public static parse(input: string): JSONObject[] {
        let buffer: string = input.replace(SPLIT, " ");
        try {
            return JSON.parse(buffer);
        } catch(e) {
            let pos: number = parseInt(e.message.slice(e.message.lastIndexOf(" ") + 1));
            let lines: string[] = input.split(LNBR_SEQ);
            for(let i: number = 0; i < lines.length; ++i) {
                let line: string = lines[i].replace(SPLIT, " ");
                if (line.length > pos) {
                    throw new SyntaxError(`Unexpected token in RandONC at line ${i + 1}: ${line}`);
                } else {
                    pos -= line.length;
                }
            }
            throw new SyntaxError("Unexpected end of input in RandONC");
        }
    }

}