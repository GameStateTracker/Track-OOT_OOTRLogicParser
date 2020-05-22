"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractElement = /** @class */ (function () {
    function AbstractElement() {
        this.children = [];
    }
    AbstractElement.prototype.toJSON = function () {
        throw new TypeError("can not call abstract method");
    };
    AbstractElement.prototype.append = function (el) {
        var _this = this;
        if (Array.isArray(el)) {
            el.forEach(function (e) { return _this.children.push(e); });
        }
        else {
            this.children.push(el);
        }
    };
    return AbstractElement;
}());
exports.default = AbstractElement;
