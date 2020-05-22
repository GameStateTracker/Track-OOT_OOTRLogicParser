"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractElement_1 = __importDefault(require("./AbstractElement"));
var OperatorXor = /** @class */ (function (_super) {
    __extends(OperatorXor, _super);
    function OperatorXor() {
        return _super.call(this) || this;
    }
    OperatorXor.prototype.toJSON = function () {
        return {
            type: "xor",
            el: Array.from(this.children).slice(0, 2).map(function (e) { return e.toJSON(); })
        };
    };
    return OperatorXor;
}(AbstractElement_1.default));
exports.default = OperatorXor;
