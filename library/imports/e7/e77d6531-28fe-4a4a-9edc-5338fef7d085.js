"use strict";
cc._RF.push(module, 'e77d6UxKP5KSp7cUzj+99CF', 'GameErrorCode');
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