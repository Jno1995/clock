const GameConst = {

    VERSION_STRING: "v1.0.37",
    DELAY_CLICK_ENABLE_TIME: 2000, // 连续点击间隔

    DEFAULT_HEAD_AVATAR_FRAME_NAME: 'default_head', // 角色默认头像名

    // 游戏域名配置

    // 游戏资源文件res下包含的文件夹名
    URL_RES_INCLUDE_FILE: [
        'prefabs',
        'texture'
    ],

    // 游戏资源文件res下包含的图集名
    URL_RES_INCLUDE_SPRITE_ATLAS: [
        'buttons',
        // 'interact',
        // 'mainview',
        'texts'
    ],
    
    //游戏难度命名常量

    //最大游戏时间（超时）
    INDEX_TO_POINT: [[-220, 381], [-110, 381], [0, 381], [110, 381], [220, 381], [-275, 286], [-165, 286], [-55, 286], [55, 286], [165, 286], [275, 286], [-330, 191], [-220, 191], [-110, 191], [0, 191], [110, 191], [220, 191], [330, 191], [-385, 95], [-275, 95], [-165, 95], [-55, 95], [55, 95], [165, 95], [275, 95], [385, 95], [-440, 0], [-330, 0], [-220, 0], [-110, 0], [0, 0], [110, 0], [220, 0], [330, 0], [440, 0], [-385, -95], [-275, -95], [-165, -95], [-55, -95], [55, -95], [165, -95], [275, -95], [385, -95], [-330, -191], [-220, -191], [-110, -191], [0, -191], [110, -191], [220, -191], [330, -191], [-275, -286], [-165, -286], [-55, -286], [55, -286], [165, -286], [275, -286], [-220, -381], [-110, -381], [0, -381], [110, -381], [220, -381]],
    //游戏计时单位1s

    // 命令动画名字

    //Resources预制组件路径

    WX_SCENE_VALUE_1007: "1007",  // 单人聊天会话中的小程序消息卡片
    WX_SCENE_VALUE_1008: "1008",  // 群聊会话中的小程序卡片
    WX_SCENE_VALUE_1022: "1022",  // 聊天顶部置顶小程序入口
    WX_SCENE_VALUE_1044: "1044",  //  带shareTicket 的小程序消息卡片
    WX_SCENE_VALUE_1104: "1104",  //从我的小程序入口进入（微信6.7.1版本只支持ios，安卓版本暂未支持）

    SUBSTRING_LENGTH: 6, //字符串长度默认限制长度
    SUBSTRING_MAXLENGTH: 10, //字符串长度默认最大长度
    MESSAGE_SUBSTRING_MAXLENGTH: 88, //消息界面消息默认最大长度
    MESSAGE_SUBSTRING_LENGTH: 76, //消息界面消息限制长度
    SENDMORETIMES: 1,    //互动道具默认发送数量
    HOLDNUM_LEN: 2, //强制保留小数位的默认长度

    //背景精灵贴图文件名
    BG_TEXTURE_NAME: [
        null,
        "",
        ""
    ],

    COLOR_TYPE: {
        TYPE_0: { r: 255, g: 255, b: 255, a: 255 }, // #FFFFFF
        TYPE_1: { r: 72, g: 115, b: 87, a: 255 }, // #487357
        TYPE_2: { r: 147, g: 136, b: 106, a: 255 }, // #93886A
        TYPE_3: { r: 255, g: 215, b: 0, a: 255 }, // #FFD700
        TYPE_4: { r: 255, g: 255, b: 141, a: 255 }, // #FFFF8D
        TYPE_5: { r: 162, g: 95, b: 24, a: 255 }, // #A25F18
        TYPE_6: { r: 228, g: 225, b: 169, a: 255 }, // #E4E1A9
        TYPE_7: { r: 206, g: 155, b: 98, a: 255 }, // #CE9B62
        TYPE_8: { r: 163, g: 151, b: 104, a: 255 }, // #A39768
        TYPE_9: { r: 88, g: 200, b: 100, a: 255 }, // #58C864
        TYPE_10: { r: 218, g: 114, b: 27, a: 255 }, // #DA721B
        TYPE_11: { r: 158, g: 99, b: 31, a: 255 },  //#9E631F
        TYPE_12: { r: 148, g: 137, b: 137, a: 255 }, //#948989
        TYPE_13: { r: 240, g: 240, b: 50, a: 255 },  //#F0F032
        TYPE_14: { r: 182, g: 64, b: 22, a: 255 },  //#B64016
        TYPE_15: { r: 240, g: 60, b: 45, a: 255 },  //#FO3C2D
        TYPE_16: { r: 204, g: 138, b: 85, a: 255 },//#CC8A55
        get(typeVal) {
            if ('undefined' !== typeof (this['TYPE_' + typeVal])) {
                return new cc.Color(this['TYPE_' + typeVal]);
            }

            return new cc.Color(this.TYPE_0);
        }
    },
};
module.exports = GameConst;
cc.GameConst = GameConst;