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

    properties: {
        animation: cc.Animation,
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable: function () {
        //var animation = this.animation;

        //animation.on('play',      this.onPlay,        this);
        //animation.on('stop',      this.onStop,        this);
        //animation.on('lastframe', this.onLastFrame,   this);
        this.animation.on('finished', this.onFinished, this);
        //animation.on('pause',     this.onPause,       this);
        //animation.on('resume',    this.onResume,      this);
    },

    onDisable: function () {
        //var animation = this.animation;

        //animation.off('play',      this.onPlay,        this);
        //animation.off('stop',      this.onStop,        this);
        //animation.off('lastframe', this.onLastFrame,   this);
        this.animation.off('finished', this.onFinished, this);
        //animation.off('pause',     this.onPause,       this);
        //animation.off('resume',    this.onResume,      this);
    },

    onFinished(event) {
        // this.node.destroy();
        if (this.animation.node.name === "cocos_icon") {
            cc.find("Canvas/game_log").getComponent(cc.Animation).play();
        }
        if (this.animation.node.name === "game_log") {
            let progressNode = cc.find("Canvas/res_load_progressBar")
            cc.WXHelper.downloadAllResources(progressNode, (node, downloadProgress) => {
                let fadeIn = cc.fadeIn(0.5);
                node.runAction(fadeIn);
                node.getComponent(cc.ProgressBar).progress = downloadProgress;
                if (downloadProgress === 100) {
                    node.destroy();
                    if (cc.WXHelper.iswxPlatform()) {
                        cc.WXHelper._login(() => {
                            cc.WXHelper._getUserInfo(() => {
                                cc.director.loadScene("hall");
                            });
                        });
                    }
                }
            });
        }
        if (this.animation.node.name === "test") {
            console.log("test");
        }
    },
});
