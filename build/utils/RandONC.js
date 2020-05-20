"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LNBR_SEQ = /(?:\r\n|\n|\r)/g;
var SPLIT = /(\#.*)?\s*\n\s*/g;
var RandONC = /** @class */ (function () {
    function RandONC() {
    }
    RandONC.parse = function (input) {
        var buffer = input.replace(SPLIT, " ");
        try {
            return JSON.parse(buffer);
        }
        catch (e) {
            var pos = parseInt(e.message.slice(e.message.lastIndexOf(" ") + 1));
            var lines = input.split(LNBR_SEQ);
            for (var i = 0; i < lines.length; ++i) {
                var line = lines[i].replace(SPLIT, " ");
                if (line.length > pos) {
                    throw new SyntaxError("Unexpected token in RandONC at line " + (i + 1) + ": " + line);
                }
                else {
                    pos -= line.length;
                }
            }
            throw new SyntaxError("Unexpected end of input in RandONC");
        }
    };
    return RandONC;
}());
exports.default = RandONC;
