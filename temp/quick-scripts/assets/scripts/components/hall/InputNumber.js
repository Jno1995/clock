(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/hall/InputNumber.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3836avgHaRHJZvbu/1ZZ4Pj', 'InputNumber', __filename);
// scripts/components/hall/InputNumber.ts

"use strict";
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
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._inputCount = 0;
        _this._timeNum = [];
        return _this;
    }
    NewClass.prototype.start = function () {
        this.initListenHandlers();
    };
    NewClass.prototype.initListenHandlers = function () {
        var _this = this;
        cc.find("content/title", this.node).on(cc.Node.EventType.TOUCH_START, function () {
            _this.closePanelEvent();
        });
    };
    NewClass.prototype.closePanelEvent = function () {
        this.node.y = -640;
        this.node.opacity = 0;
        this._inputCount = 0;
    };
    NewClass.prototype.onNumBtnClicked = function (event, CustomEventData) {
        // cc.vv.audioMgr.playClickedBgm();
        if (this._inputCount < 6) {
            if (this._inputCount === 2 || this._inputCount == 4) {
                if (CustomEventData >= 6) {
                    CustomEventData = 5;
                }
            }
            this._timeNum[this._inputCount] = CustomEventData;
            this.inputBox['children'][this._inputCount]['children'][0].getComponent(cc.Label).string = CustomEventData;
            this._inputCount++;
            if (this._inputCount == 6) {
                //关闭界面 刷新大厅倒计时文本  并且启动倒计时
                this.closePanelEvent();
                var hour = Number(this._timeNum[0] + this._timeNum[1]);
                var minute = Number(this._timeNum[2] + this._timeNum[3]);
                var second = Number(this._timeNum[4] + this._timeNum[5]);
                cc.find("Canvas/n_layout/l_countDown").getComponent(cc.Label).string = cc.Utils.getTimeString(hour * 3600 + minute * 60 + second);
                cc.find("Canvas/n_layout/l_countDown").getComponent("CountDown")._countDownNum = hour * 3600 + minute * 60 + second;
            }
        }
        else {
            return;
        }
    };
    NewClass.prototype.onResetBtnClicked = function () {
        // cc.vv.audioMgr.playClickedBgm();
        for (var i = 0; i < this.inputBox['children'].length; i++) {
            this.inputBox['children'][i]['children'][0].getComponent(cc.Label).string = '';
        }
    };
    NewClass.prototype.onCleanBtnClicked = function () {
        // cc.vv.audioMgr.playClickedBgm();
        if (this._inputCount == 0) {
            return;
        }
        else {
            this.inputBox['children'][this._inputCount - 1]['children'][0].getComponent(cc.Label).string = '';
            this._inputCount--;
        }
    };
    __decorate([
        property({
            type: cc.Integer,
        })
    ], NewClass.prototype, "_inputCount", void 0);
    __decorate([
        property({
            type: cc.Node,
            displayName: "数字输入框"
        })
    ], NewClass.prototype, "inputBox", void 0);
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
        //# sourceMappingURL=InputNumber.js.map
        