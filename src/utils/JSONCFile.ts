import fs from "fs";

declare global {
    type JSONCObject = string | number | boolean | JSONCArray | JSONCMap;
    type JSONCArray = JSONCObject[];
    type JSONCMap = { [index: string]: JSONCObject };
}

export default abstract class JSONCFile {

    public static read(filename: string, def: JSONCObject): JSONCObject {
        if (fs.existsSync(filename)) {
            let data = fs.readFileSync(filename).toString();
            return JSONCFile.parse(data);
        }
        return def;
    }

    public static write(filename: string, data: any) {
        fs.writeFileSync(filename, JSON.stringify(data, null, 4));
    }

    private static parse(input: string): JSONCObject {
        let buffer = removeComments(input);
        try {
            return JSON.parse(buffer);
        } catch(e) {
            console.log(buffer);
            let pos = parseInt(e.message.slice(e.message.lastIndexOf(" ") + 1));
            let ref = input.split(LNBR_SEQ);
            let lines = buffer.split(LNBR_SEQ);
            for(let i = 0; i < lines.length; ++i) {
                let line = lines[i] + "\n";
                if (pos < line.length) {
                    let p = pos;
                    let l = ref[i];
                    throw new SyntaxError(`Unexpected token in JSONC at line ${i + 1}:\n${l}\n${(new Array(pos + 1)).join(" ")}^`);
                } else {
                    pos -= line.length;
                }
            }
            throw new SyntaxError("Unexpected end of input in JSONC");
        }
    }

}

type StateBuffer = {
    lines: string[],
    linesRes: string[],
    line: string[],
    lineRes: string[]
};

const LNBR_SEQ = /(?:\r\n|\n|\r)/g;
const STRING = /("(?:[^"\\]|\\.)*")/;
const ALL_BUT_NL = /[^\r\n]/g;
const COMMENT_START = /(\/(?:\*|\/))/g;

function splitFirst(input: string, delimiter: string | RegExp): string[] {
    let spl = input.split(delimiter);
    if (spl.length > 1) {
        return [
            <string> spl.shift(),
            spl.join("")
        ];
    } else {
        return [
            <string> spl.shift()
        ];
    }
}

function removeComments(input: string): string {
    let state: StateBuffer = {
        lines: input.split(LNBR_SEQ),
        linesRes: [],
        line: [],
        lineRes: []
    };
    while (!!state.lines.length) {
        let line = <string> state.lines.shift();
        if (line.indexOf("//") < 0 && line.indexOf("/*") < 0) {
            state.linesRes.push(line);
        } else {
            state.line = line.split(STRING);
            removeCommentsLine(state);
            state.linesRes.push(state.lineRes.join(""));
            state.lineRes = [];
        }
    }
    return state.linesRes.join("\n");
}

function removeCommentsLine(state: StateBuffer) {
    while (!!state.line.length) {
        let act = <string> state.line.shift();
        if (act.startsWith('"')) {
            state.lineRes.push(act);
        } else if (act.indexOf("//") < 0 && act.indexOf("/*") < 0) {
            state.lineRes.push(act);
        } else {
            removeCommentsStart(state, act);
        }
    }
}

function removeCommentsStart(state: StateBuffer, act: string) {
    let spls = splitFirst(act, COMMENT_START);
    state.lineRes.push(spls[0]);
    if (spls[1].startsWith("//")) {
        state.lineRes.push(spls[1].replace(ALL_BUT_NL, " "));
        state.lineRes.push(state.line.join("").replace(ALL_BUT_NL, " "));
        state.line = [];
    }
    if (spls[1].startsWith("/*")) {
        let sple = splitFirst(spls[1], "*/");
        if (sple.length > 1) {
            state.lineRes.push(sple[0].replace(ALL_BUT_NL, " ") + "  ");
            state.line.unshift(sple[1]);
        } else {
            let remaining = splitFirst(state.line.join(""), "*/");
            state.line = [];
            state.lineRes.push(remaining[0].replace(ALL_BUT_NL, " ") + "  ");
            if (remaining.length > 1) {
                state.line.unshift(remaining[1]);
            } else {
                while (!!state.lines.length) {
                    let line = <string> state.lines.shift();
                    if (line.indexOf("*/") < 0) {
                        state.linesRes.push(line.replace(ALL_BUT_NL, " ") + "  ");
                    } else {
                        let sple2 = splitFirst(line, "*/");
                        state.lineRes.push(sple2[0].replace(ALL_BUT_NL, " ") + "  ");
                        state.line.unshift(sple2[1]);
                        break;
                    }
                }
            }
        }
    }
}