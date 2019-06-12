(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/GameErrorCode.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e77d6UxKP5KSp7cUzj+99CF', 'GameErrorCode', __filename);
// scripts/components/GameErrorCode.js

"use strict";

// 游戏客户端类型
var ErrCodeEnterRoom = cc.Enum({

    ERR_ROOM_NOT_FOUND: 101, // 房间不存在
    ERR_ROOM_FULL: 102, // 房间已满
    ERR_ROOM_EXIST: 103, // 已有房间
    ERR_ROOM_MONEY_LACK: 104 // 代币不足
});

module.exports = {
    ErrCodeEnterRoom: ErrCodeEnterRoom
};

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
        //# sourceMappingURL=GameErrorCode.js.map
        