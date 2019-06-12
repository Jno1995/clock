"use strict";
cc._RF.push(module, 'c2c0bVhMh1GBYrXqUqi8UrZ', 'GameResource');
// scripts/components/GameResource.js

"use strict";

var _MJ_HU_AUDIO_RES;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {},

    statics: {
        MJ_AUDIO_RES: {
            // 中发白
            MJ_AUDIO_01: "zhong",
            MJ_AUDIO_02: "fa", // 发财
            MJ_AUDIO_03: "bai",

            // 东南西北风
            MJ_AUDIO_11: "dongfeng",
            MJ_AUDIO_13: "xifeng",
            MJ_AUDIO_12: "nanfeng",
            MJ_AUDIO_14: "beifeng",

            // 万
            MJ_AUDIO_21: "wan1",
            MJ_AUDIO_22: "wan2",
            MJ_AUDIO_23: "wan3",
            MJ_AUDIO_24: "wan4",
            MJ_AUDIO_25: "wan5",
            MJ_AUDIO_26: "wan6",
            MJ_AUDIO_27: "wan7",
            MJ_AUDIO_28: "wan8",
            MJ_AUDIO_29: "wan9",

            // 条
            MJ_AUDIO_31: "tiao1",
            MJ_AUDIO_32: "tiao2",
            MJ_AUDIO_33: "tiao3",
            MJ_AUDIO_34: "tiao4",
            MJ_AUDIO_35: "tiao5",
            MJ_AUDIO_36: "tiao6",
            MJ_AUDIO_37: "tiao7",
            MJ_AUDIO_38: "tiao8",
            MJ_AUDIO_39: "tiao9",

            // 饼
            MJ_AUDIO_41: "tong1",
            MJ_AUDIO_42: "tong2",
            MJ_AUDIO_43: "tong3",
            MJ_AUDIO_44: "tong4",
            MJ_AUDIO_45: "tong5",
            MJ_AUDIO_46: "tong6",
            MJ_AUDIO_47: "tong7",
            MJ_AUDIO_48: "tong8",
            MJ_AUDIO_49: "tong9",

            // 花牌
            MJ_AUDIO_51: null, // 春
            MJ_AUDIO_52: null, // 夏
            MJ_AUDIO_53: null, // 秋
            MJ_AUDIO_54: null, // 冬
            MJ_AUDIO_58: null, // 竹
            MJ_AUDIO_56: null, // 兰
            MJ_AUDIO_55: null, // 梅
            MJ_AUDIO_57: null, // 菊

            // 操作
            MJ_AUDIO_61: "gang", // 杠
            MJ_AUDIO_62: "buhua", // 补花
            MJ_AUDIO_63: "peng", // 碰
            MJ_AUDIO_64: "ting", // 听
            MJ_AUDIO_65: "chi", // 吃
            MJ_AUDIO_66: null, // 过
            MJ_AUDIO_67: "mahjong_drop", // 出牌落地
            MJ_AUDIO_68: "timeup_alarm", // 倒计时
            MJ_AUDIO_69: "mahjong_select", // 选中牌
            MJ_AUDIO_70: "mahjong_win", // 胜利
            MJ_AUDIO_71: "mahjong_lose", // 失败
            MJ_AUDIO_72: "mahjong_huang", // 黄庄
            MJ_AUDIO_73: null, // 摸牌
            MJ_AUDIO_74: "guafeng", // 刮风字
            MJ_AUDIO_75: "xlch_guafeng_small", // 刮风声音
            MJ_AUDIO_76: "xiayu", // 下雨风字
            MJ_AUDIO_77: "xlch_xiayu_small", // 下雨声音	

            // 胜利
            MJ_AUDIO_81: "woman_hu", // 胡
            MJ_AUDIO_82: "woman_zimo", // 自摸
            MJ_AUDIO_83: "jinque", // 金雀
            MJ_AUDIO_84: "jinlong", // 金龙
            MJ_AUDIO_85: "qiangjin", // 抢金
            MJ_AUDIO_86: "tianhu", // 天胡
            MJ_AUDIO_87: "sanjindao", // 三金倒
            MJ_AUDIO_88: "wuhuawugang", // 无花无杠
            MJ_AUDIO_89: "yizhihua", // 一枝花

            // 聊天
            MJ_AUDIO_101: "fix_msg_1",
            MJ_AUDIO_102: "fix_msg_2",
            MJ_AUDIO_103: "fix_msg_3",
            MJ_AUDIO_104: "fix_msg_4",
            MJ_AUDIO_105: "fix_msg_5",
            MJ_AUDIO_106: "fix_msg_6",
            MJ_AUDIO_107: "fix_msg_7",
            MJ_AUDIO_108: "fix_msg_8",
            MJ_AUDIO_109: "fix_msg_9",
            MJ_AUDIO_110: "fix_msg_10",
            MJ_AUDIO_111: "fix_msg_11",

            get: function get(musicVal) {
                if ('undefined' !== typeof this['MJ_AUDIO_' + musicVal]) {
                    var setData = cc.vv.localData.setting;

                    var localLanStr = 'fz/'; // TODO:判断方言类型
                    var lanType = typeof setData.lan_type !== 'undefined' ? setData.lan_type : 0;
                    var lanTypeStr = 0 == lanType ? 'mandarin/' : 'dialect/' + localLanStr;

                    var sex = typeof setData.lan_sex !== 'undefined' ? setData.lan_sex : 0;
                    var sexStr = 0 == sex ? 'man/' : 'woman/';

                    var url = 'resources/audio/dubbing/mahjong/' + lanTypeStr + sexStr;

                    if (musicVal >= 67 && musicVal <= 73) {
                        url = 'resources/audio/';
                    }

                    return url + this['MJ_AUDIO_' + musicVal] + '.mp3';
                }

                return null;
            }
        },

        MJ_HU_AUDIO_RES: (_MJ_HU_AUDIO_RES = {
            HU_5: "", // 一条龙
            HU_6: "", // 清一色
            HU_7: "", // 七对子
            HU_8: "", // 豪华七对子
            HU_9: "woman_zimo", // 自摸
            HU_10: "woman_hu", // 平胡
            HU_11: "tianhu", // 天胡
            HU_12: "qiangjin", // 抢金
            HU_13: "wuhuawugang", // 无花无杠
            HU_14: "yizhihua", // 一张花
            HU_15: "sanjindao", // 三金倒
            HU_16: "jinque", // 金雀
            HU_17: "jinlong", // 金龙
            HU_22: "sijindao", // 四金倒
            HU_23: "", // 清一色
            HU_24: "", // 清一色
            HU_27: "", // 混一色
            HU_37: "woman_hu", // 杠上开花
            HU_31: "",
            HU_32: "",
            HU_33: "",
            HU_34: "",
            HU_36: "tianhu" }, _defineProperty(_MJ_HU_AUDIO_RES, "HU_37", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_38", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_39", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_40", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_41", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_42", "tianhu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_43", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_44", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_45", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_46", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_47", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_48", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_49", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_50", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_51", "tianhu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_52", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_53", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_54", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_55", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_56", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_57", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_58", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_59", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_60", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_61", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_62", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "HU_63", "woman_hu"), _defineProperty(_MJ_HU_AUDIO_RES, "get", function get(musicVal) {
            if ('undefined' !== typeof this['HU_' + musicVal]) {
                var setData = cc.vv.localData.setting;

                var localLanStr = 'fz/'; // TODO:判断方言类型
                var lanType = typeof setData.lan_type !== 'undefined' ? setData.lan_type : 0;
                var lanTypeStr = 0 == lanType ? 'mandarin/' : 'dialect/' + localLanStr;

                var sex = typeof setData.lan_sex !== 'undefined' ? setData.lan_sex : 0;
                var sexStr = 0 == sex ? 'man/' : 'woman/';

                var url = 'resources/audio/dubbing/mahjong/' + lanTypeStr + sexStr;

                return url + this['HU_' + musicVal] + '.mp3';
            }

            return null;
        }), _MJ_HU_AUDIO_RES),

        MJ_CMD_HU_TYPE_IMG_RES: {
            // 默认纹理（福州）
            TYPE_6: "battle_opt_qingyise",
            TYPE_7: "battle_opt_qiduizi", // 七对子
            TYPE_8: "battle_opt_haohuaqiduizi", // 豪华七对子
            TYPE_9: "battle_opt_zimo",
            TYPE_10: "battle_opt_hu",
            TYPE_11: "battle_opt_tianhu",
            TYPE_12: "battle_opt_qiangjin",
            TYPE_15: "battle_opt_sanjindao",
            TYPE_16: "battle_opt_jinque",
            TYPE_17: "battle_opt_jinlong",
            TYPE_22: "battle_opt_sijindao",
            TYPE_23: "battle_opt_dihu",
            TYPE_24: "battle_opt_jingang",
            TYPE_25: "battle_opt_dandiao",
            TYPE_27: "battle_opt_hunyise",
            TYPE_56: "battle_opt_jinkan", // 金坎

            // 宁德
            TYPE_4007: "battle_opt_duiduihu", // 对对胡
            TYPE_4017: "battle_opt_jinshun", // 金顺

            get: function get(typeVal) {
                var gameType = cc.vv.global.GAME_TYPE;
                if ('undefined' !== typeof this['TYPE_' + (gameType * 1000 + typeVal)]) {
                    return this['TYPE_' + (gameType * 1000 + typeVal)];
                } else if ('undefined' !== typeof this['TYPE_' + typeVal]) {
                    return this['TYPE_' + typeVal];
                }

                return this.TYPE_10;
            }
        },

        MJ_SIGN_HU_TYPE_IMG_RES: {
            // 默认纹理（福州）
            TYPE_6: "battle_hu_qingyise",
            TYPE_7: "battle_hu_qiduizi", // 七对子
            TYPE_8: "battle_hu_haohuaqiduizi", // 豪华七对子
            TYPE_9: "battle_hu_zimo",
            TYPE_10: "battle_hu_hupai",
            TYPE_11: "battle_hu_tianhu",
            TYPE_12: "battle_hu_qiangjin",
            TYPE_13: "battle_hu_wuhuawugang",
            TYPE_14: "battle_hu_yizhihua",
            TYPE_15: "battle_hu_sanjindao",
            TYPE_16: "battle_hu_jinque",
            TYPE_17: "battle_hu_jinlong",
            TYPE_18: "battle_hu_youjin",
            TYPE_19: "battle_hu_shuangyou",
            TYPE_20: "battle_hu_sanyou",
            TYPE_22: "battle_hu_sijindao",
            TYPE_23: "battle_hu_dihu",
            TYPE_24: "battle_hu_jingang",
            TYPE_25: "battle_hu_dandiao",
            TYPE_26: "battle_hu_youjin",
            TYPE_27: "battle_hu_hunyise",
            TYPE_56: "battle_hu_jinkan",

            // 宁德
            TYPE_4007: "battle_hu_duiduihu", // 对对胡
            TYPE_4017: "battle_hu_jinshun", // 金顺

            get: function get(typeVal) {
                var gameType = cc.vv.global.GAME_TYPE;
                if ('undefined' !== typeof this['TYPE_' + (gameType * 1000 + typeVal)]) {
                    return this['TYPE_' + (gameType * 1000 + typeVal)];
                } else if ('undefined' !== typeof this['TYPE_' + typeVal]) {
                    return this['TYPE_' + typeVal];
                }

                return this.TYPE_10;
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();