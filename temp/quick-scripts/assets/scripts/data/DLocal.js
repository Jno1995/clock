(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/data/DLocal.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '732cbdleihHvbxN92Jqjwph', 'DLocal', __filename);
// scripts/data/DLocal.js

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

cc.Class({
    extends: cc.Component,

    properties: {
        option: null,
        setting: null
    },

    init: function init() {

        this.option = {
            optionsum: 4,
            jushu: 4, //4局
            jifen: 6, //放胡单赔
            renshu: 9, //4人局
            fangfei: 14, //房主付费     
            //福州麻将玩法
            qingyise: 1,
            jinlong: 0,
            jinkan: 0,
            //宁德麻将玩法
            duiduihu: 0,
            //房费
            roomPrice: 2
        };

        this.setting = {
            sound_volum: 1,
            sfx_volum: 1,
            sound_switch: 1,
            sfx_switch: 1,
            //table_color: 0, // 桌布颜色：0：绿色；1：蓝色
            //ting_tip_type: 0, // 听牌提示：0：开启；1：关闭
            lan_type: 1, // 配音语言：0：普通话；1：本地话
            lan_sex: 0, // 配音性别：0：男声；1：女声
            no_warning_match_id: 0 // 不再提醒的比赛id
        };

        this.loadOption();
        this.loadSetting();
    },
    loadOption: function loadOption() {
        if (cc.vv.wxHelper.iswxPlatform()) {
            console.log('In Weixin');
            var optionstorage = wx.getStorageSync('option');
            console.log(typeof optionstorage === 'undefined' ? 'undefined' : _typeof(optionstorage));
            if (typeof optionstorage != "string") {
                //对象为空的话  类型为string
                this.option = optionstorage;
            }
            // wx.getStorage({ // 异步缓存只能在本次页面生命周期中提取到set的数据 方法保留
            //   key: 'option',
            //   success: function(res) {
            //     console.log(res)
            //     this.option = res.data;
            //   },
            // })
        } else {
            var storagestr = JSON.parse(cc.sys.localStorage.getItem("option"));
            if (storagestr != null) {
                for (var key in storagestr) {
                    this.option[key] = storagestr[key];
                }
            }
        }
    },
    loadSetting: function loadSetting() {
        if (cc.vv.wxHelper.iswxPlatform()) {
            var settingstorage = wx.getStorageSync('setting');
            console.log(typeof settingstorage === 'undefined' ? 'undefined' : _typeof(settingstorage));
            if (typeof settingstorage != "string") {
                this.setting = settingstorage;
            }
        } else {
            var storagestr = JSON.parse(cc.sys.localStorage.getItem("setting"));
            if (storagestr != null) {
                for (var key in storagestr) {
                    this.setting[key] = storagestr[key];
                }
            }
        }
    },
    saveOption: function saveOption() {
        if (cc.vv.wxHelper.iswxPlatform()) {
            wx.setStorageSync('option', this.option);
        } else {
            cc.sys.localStorage.setItem("option", JSON.stringify(this.option));
        }
        // wx.setStorage(
        //   {
        //     key: 'option',
        //     data: this.option,
        //     success: function(res) {
        //       console.log(res)
        //     }
        //   }
        // )
    },
    saveSetting: function saveSetting() {
        if (cc.vv.wxHelper.iswxPlatform()) {
            wx.setStorageSync('setting', this.setting);
        } else {
            cc.sys.localStorage.setItem("setting", JSON.stringify(this.setting));
        }

        // wx.setStorage(
        //   {
        //     key: 'setting',
        //     data: this.setting,
        //     success: function(res) {
        //       console.log(res)
        //     }
        //   }
        // )
    }

    // update (dt) {},

});

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
        //# sourceMappingURL=DLocal.js.map
        