(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/hall/Hall.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a94d9ZkrxlDp4L9XJ9kkKd+', 'Hall', __filename);
// scripts/components/hall/Hall.ts

"use strict";
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    NewClass.prototype.start = function () {
        this.initListenHandlers();
        var nowData = Date.parse(new Date()) / 1000;
        var hms = cc.Utils.getTimeStampToNow(nowData, ["/", "/", ""], "ALL");
        cc.find("Canvas/n_layout/l_nowTime_value").getComponent(cc.Label).string = hms;
        setInterval(function () {
            var nowData = Date.parse(new Date()) / 1000;
            var hms = cc.Utils.getTimeStampToNow(nowData, ["/", "/", ""], "ALL");
            cc.find("Canvas/n_layout/l_nowTime_value").getComponent(cc.Label).string = hms;
        }, 1000);
    };
    NewClass.prototype.initListenHandlers = function () {
        this.lCountDown.on(cc.Node.EventType.TOUCH_START, this.onLCountDownTouchEvent, this);
    };
    NewClass.prototype.onLCountDownTouchEvent = function () {
        if (!this.inputNode) {
            this.inputNode = cc.instantiate(this.inputNumber);
            this.node.addChild(this.inputNode);
        }
        else {
            this.inputNode.y = 0;
            this.inputNode.opacity = 255;
            this.inputNode.getComponent("InputNumber").onResetBtnClicked();
        }
    };
    __decorate([
        property({
            displayName: "倒计时文本",
            type: cc.Node
        })
    ], NewClass.prototype, "lCountDown", void 0);
    __decorate([
        property({
            displayName: "数字按键预制",
            type: cc.Prefab
        })
    ], NewClass.prototype, "inputNumber", void 0);
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

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
        //# sourceMappingURL=Hall.js.map
        