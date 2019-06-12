"use strict";
cc._RF.push(module, '99741zHCzREprH/syFX4vpW', 'ColliderListener');
// scripts/components/collider/ColliderListener.js

'use strict';

// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    editor: {
        menu: "自定义组件/碰撞组件/碰撞监听",
        requireComponent: cc.BoxCollider,
        disallowMultiple: true
    },
    properties: {},

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onLoad: function onLoad() {
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        // cc.director.getCollisionManager().enabledDrawBoundingBox = true; 
        // this.touchingNumber = 0;
    },
    onCollisionEnter: function onCollisionEnter(other) {
        //TODO: 道具
        if (this.node.group == 'prop') {
            this.node.destroy();
        }
        if (this.node.group == 'wall') {
            //TODO: 墙壁是需要多次打击才能被销毁
            this.node.destroy();
        }
        if (this.node.group == 'gasoline') {
            //TODO: 汽油
            this.node.destroy();
        }
        if (this.node.group == 'enemy') {
            //TODO:敌人
            this.node.destroy();
        }
        if (this.node.group == 'cartridge') {
            //TODO:子弹
            this.node.destroy();
        }
        // this.touchingNumber++;
    },

    onCollisionStay: function onCollisionStay(other) {
        // console.log('on collision stay');
    },

    onCollisionExit: function onCollisionExit() {}
    // this.touchingNumber--;
    // if (this.touchingNumber === 0) {
    //     this.node.color = cc.Color.WHITE;
    // }


    // update (dt) {},
});

cc._RF.pop();