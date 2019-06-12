(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/GameLanguage.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2efe2v60JhJyJSnejSOfrEB', 'GameLanguage', __filename);
// scripts/components/GameLanguage.js

"use strict";

var GameLanguage = {};
GameLanguage.zhLanguage = ["游戏版本:", //0
"游戏作者:", //1
"你赢了", //2
"你输了", //3
"暂停", //4
"{0}:{1}:{2}", //5
"挑战超时", //6
"暂无成功记录" //7
];
GameLanguage.enLanguage = ["gameVersion:", "gameAutor", "You Win", "You Lose", "pause", "{0}:{1}", "challengeTimeout", "noRecordOfSuccess"];
module.exports = GameLanguage;
cc.GameLanguage = GameLanguage;

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
        //# sourceMappingURL=GameLanguage.js.map
        