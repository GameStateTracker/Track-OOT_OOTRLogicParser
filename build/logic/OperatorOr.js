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
var OperatorOr = /** @class */ (function (_super) {
    __extends(OperatorOr, _super);
    function OperatorOr() {
        return _super.call(this) || this;
    }
    OperatorOr.prototype.toJSON = function () {
        return {
            type: "or",
            el: Array.from(this.children).map(function (e) { return e.toJSON(); })
        };
    };
    return OperatorOr;
}(AbstractElement_1.default));
exports.default = OperatorOr;
