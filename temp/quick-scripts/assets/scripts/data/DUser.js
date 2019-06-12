(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/data/DUser.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '74021n2svlCUKB5N3rrCbn/', 'DUser', __filename);
// scripts/data/DUser.js

"use strict";

var DataUser = {
    userName: null,
    avatarUrl: null,
    bestRecord: null, //最佳成绩
    currentRecord: null, //当前成绩
    gameStatus: null
};
module.exports = DataUser;
cc.DataUser = DataUser;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=DUser.js.map
        