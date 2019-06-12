//文档:https://docs.cocos.com/creator/manual/zh/
//API:https://docs.cocos.com/creator/api/zh/
//iusses:https://github.com/cocos-creator/2d-tasks/issues
//仓库:https://github.com/cocos-creator/engine
//属性检查器参数:https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html?h=属性参数
//自定义组件:https://docs.cocos.com/creator/manual/zh/scripting/reference/class.html#editor-%E5%8F%82%E6%95%B0
//Joho gitHub:https://github.com/Jno1995
// const lodsh = require("../../../third/lodash.core.js");
cc.Class({
    extends: cc.Component,
    editor: {
        executeInEditMode: true,
    },
    properties: {
        gameVersion: {
            default: null,
            type: cc.Label
        },
        gameAutor: {
            default: null,
            type: cc.Label
        },
        cocosVersion: {
            default: null,
            type: cc.Label
        }
    },

    update() {

    },
    
    start() {
    },

    onEnable() {
        if (CC_EDITOR) {
            let canvas = this.node.getComponent(cc.Canvas);
            canvas.fitHeight = cc.GameConfig.fitHeight;
            canvas.fitWidth = cc.GameConfig.fitWidth;
            canvas.designResolution = cc.size(cc.GameConfig.designWidth, cc.GameConfig.designHeight);

            this.gameVersion.string = cc.GameLanguage.zhLanguage[0] + cc.GameConfig.gameVersion;
            this.gameAutor.string = cc.GameLanguage.zhLanguage[1] + cc.GameConfig.gameAutor;
        }
    },

    onLoadResEvent() {

    },

    init() {

    },

    onWxMixGameLoadingEvent() {

    },
});
