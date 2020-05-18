"use strict";
var AMOUNT = /\([^,()]+,\s*[0-9]+\)/;
var BRACKETS = /\([^,()]+\)/;
var RandLogic = /** @class */ (function () {
    function RandLogic() {
    }
    RandLogic.prototype.parse = function (input) {
        console.log(input);
    };
    return RandLogic;
}());
module.exports = new RandLogic();
