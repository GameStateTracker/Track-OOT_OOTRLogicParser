"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var LiteralValue_1 = __importDefault(require("../logic/LiteralValue"));
var OperatorAnd_1 = __importDefault(require("../logic/OperatorAnd"));
var OperatorOr_1 = __importDefault(require("../logic/OperatorOr"));
var OperatorMin_1 = __importDefault(require("../logic/OperatorMin"));
var LogicBuilder = /** @class */ (function () {
    function LogicBuilder() {
    }
    LogicBuilder.build = function (token) {
        var root = token[0];
        var result = LogicBuilder.resolveToken(root, token);
        return result.toJSON();
    };
    LogicBuilder.resolveToken = function (current, token) {
        if (current.startsWith("min(")) {
            var _a = current.slice(4, -1).split(", "), ch = _a[0], value = _a[1];
            var el = new OperatorMin_1.default(parseInt(value) || 0);
            if (ch.startsWith("%")) {
                var next = token[parseInt(ch.slice(1, -1))];
                el.append(LogicBuilder.resolveToken(next, token));
            }
            else {
                el.append(LogicBuilder.resolveToken(ch, token));
            }
            return el;
        }
        if (current.indexOf(" and ") >= 0) {
            var children = current.split(" and ");
            var el = new OperatorAnd_1.default();
            for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                var ch = children_1[_i];
                if (ch.startsWith("%")) {
                    var next = token[parseInt(ch.slice(1, -1))];
                    el.append(LogicBuilder.resolveToken(next, token));
                }
                else {
                    el.append(LogicBuilder.resolveToken(ch, token));
                }
            }
            return el;
        }
        if (current.indexOf(" or ") >= 0) {
            var children = current.split(" or ");
            var el = new OperatorOr_1.default();
            for (var _b = 0, children_2 = children; _b < children_2.length; _b++) {
                var ch = children_2[_b];
                if (ch.startsWith("%")) {
                    var next = token[parseInt(ch.slice(1, -1))];
                    el.append(LogicBuilder.resolveToken(next, token));
                }
                else {
                    el.append(LogicBuilder.resolveToken(ch, token));
                }
            }
            return el;
        }
        // TODO implement this
        // XXX this is just demo code
        return new LiteralValue_1.default(current);
    };
    return LogicBuilder;
}());
exports.default = LogicBuilder;
