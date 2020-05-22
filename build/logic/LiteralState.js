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
var LiteralState = /** @class */ (function (_super) {
    __extends(LiteralState, _super);
    function LiteralState(ref, value, category) {
        var _this = _super.call(this) || this;
        _this.ref = ref;
        _this.value = value;
        _this.category = category;
        return _this;
    }
    LiteralState.prototype.toJSON = function () {
        if (!!this.category) {
            return {
                type: "state",
                el: this.ref,
                value: this.value,
                category: this.category
            };
        }
        else {
            return {
                type: "state",
                el: this.ref,
                value: this.value
            };
        }
    };
    LiteralState.prototype.append = function (el) { };
    return LiteralState;
}(AbstractElement_1.default));
exports.default = LiteralState;
