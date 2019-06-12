// var PacketWriter = require("PacketWriter");
cc.Class({
    extends: cc.Component,

    properties: {
    },

    statics: {
        curStepId: -1, // 当前要执行哪一步引导（id从0开始）
        maxStepCount: 20, // 总共有几步引导

        guideStepConfigureArr: [], // 引导配置信息

        // 检测当前是否需要引导
        checkGuide: function () {
            // TODO: 从服务器获取引导信息
            if (cc.vv.myself.guideStep == 0) {  //玩家从未开始过新手引导
                this.curStepId = 0;
                cc.vv.utils.createPrefabByUrl(cc.vv.const.URL_GUIDE_MATCH_GAME);
            }
            if (cc.vv.myself.guideStep == 1) {  //玩家在新手引导中到达了比赛结算分享阶段
                this.curStepId = 13;
            }
            if (cc.vv.myself.guideStep == 2) {  //玩家完成了新手引导
                this.curStepId = 20;
            }

            this.guideStepConfigureArr = [];

            if (this.curStepId < this.maxStepCount) {
                this.dealGuide();
            }
        },

        // 处理引导
        dealGuide: function () {
            if ('undefined' == typeof (this.guideStepConfigureArr[this.curStepId]) || null == this.guideStepConfigureArr[this.curStepId]) {
                this.initConfigure();
            } else {
                this.startGuide();
            }
        },

        // 开始引导
        startGuide: function () {
            cc.vv.utils.showGuideNode(this.guideStepConfigureArr[this.curStepId]);
        },

        // 完成一步引导
        doneGuideStep: function (step) {
            // TODO: 告诉服务器哪步引导完成了

            // 下一步
            this.curStepId += 1;

            if (this.curStepId < this.maxStepCount) {
                this.dealGuide();
            }
        },

        // 初始化引导配置
        initConfigure: function () {
            // for (var i = this.curStepId; i < this.maxStepCount; i++) {
            this['setConfigure_' + this.curStepId]();
            // }

            this.startGuide();
        },

        onSendGuideStepEvent: function (step) {
            var pw = new PacketWriter();
            pw.writeid(cc.vv.packid.PACKETID_242);
            pw.writeu1(step);
            cc.vv.socketMgr.bufferPack(pw.getdata());
            cc.vv.myself.guideStep = step;
        },
        // 设置引导配置
        // 01_介绍比赛券
        setConfigure_0: function () {
            var self = this;
            var widget = cc.find('Canvas/head/item_3');

            var dataObj = {};
            dataObj.typ = 1;
            dataObj.widget = widget;
            dataObj.offsetX = 300;
            dataObj.offsetY = -120;
            dataObj.arrow = 'lt';
            dataObj.infoStr = cc.vv.lan.MATCH_LAN[65];
            dataObj.bInfoImg = true;
            dataObj.chickIdx = 1;
            dataObj.nextStepIdx = 1;
            dataObj.nextCallFunc = function () {
                cc.vv.audioMgr.playClickedBgm();
                cc.vv.utils.createPrefabByUrl(cc.vv.const.URL_HELP, null, function (node) {
                    self.doneGuideStep();
                });
            },
                dataObj.holeCallFunc = dataObj.nextCallFunc;
            this.guideStepConfigureArr[0] = dataObj;
        },
        // 设置引导配置
        //02_引导点击  + 号  键，弹出领取比赛券界面
        setConfigure_1: function () {
            var self = this;
            var widget = cc.find('Canvas/help/bg_spr');

            var dataObj = {};
            dataObj.typ = 1;
            dataObj.widget = widget;
            dataObj.offsetX = 200;
            dataObj.offsetY = -280;
            dataObj.arrow = 'lt';
            dataObj.infoStr = cc.vv.lan.MATCH_LAN[66];
            dataObj.bInfoImg = false;
            dataObj.chickIdx = 1;
            dataObj.nextStepIdx = 1;
            dataObj.nextCallFunc = function () {
                var script = widget.parent.getComponent('Help');
                script.onCloseBtnClicked();
                self.doneGuideStep();
            },

                this.guideStepConfigureArr[1] = dataObj;
        },

        //03_引导点击报名
        setConfigure_2: function () {
            var self = this;
            var widget = cc.find('Canvas/guide_match_canvas/right/match_enroll_btn');

            var dataObj = {};
            dataObj.typ = 1;
            dataObj.widget = widget;
            dataObj.offsetX = 10;
            dataObj.offsetY = 160;
            dataObj.arrow = 'rb';
            dataObj.infoStr = cc.vv.lan.MATCH_LAN[69];
            dataObj.bInfoImg = false;
            dataObj.chickIdx = 1;
            dataObj.nextStepIdx = 1;

            dataObj.nextCallFunc = function () {
                cc.vv.audioMgr.playClickedBgm();
                dataObj.widget.active = false;
                cc.vv.utils.showDialogOKCancel(cc.vv.lan.MATCH_LAN[7].format(15), function () {
                }, function () { }, true, cc.vv.enum.EnumLabelHorizontalAlign.LEFT, function () {
                    this.wechatConcernBtn.node.active = true;
                    this.cancelBtn.node.active = false;
                    self.doneGuideStep();
                });
            },
                dataObj.holeCallFunc = dataObj.nextCallFunc;
            this.guideStepConfigureArr[2] = dataObj;
        },

        //04_弹出报名成功弹窗
        setConfigure_3: function () {
            var self = this;
            var widget = cc.find('Canvas/dialog/dialog_bg');

            var dataObj = {};
            dataObj.typ = 1;
            dataObj.widget = widget;
            dataObj.offsetX = 110;
            dataObj.offsetY = -260;
            dataObj.arrow = 'lt';
            dataObj.infoStr = cc.vv.lan.MATCH_LAN[70];
            dataObj.bInfoImg = false;
            dataObj.chickIdx = 1;
            dataObj.nextStepIdx = 1;
            dataObj.nextCallFunc = function () {
                cc.vv.audioMgr.playClickedBgm();
                var dialogNode = cc.find('Canvas/dialog');
                if (dialogNode) {
                    dialogNode.destroy();
                }
                // widget.parent.destroy();
                self.doneGuideStep();
            },

                this.guideStepConfigureArr[3] = dataObj;
        },

        //05_对局须知高亮
        setConfigure_4: function () {
            var self = this;
            var widget = cc.find('Canvas/guide_match_canvas/right/match_award_tip_lbl');

            var dataObj = {};
            dataObj.typ = 1;
            dataObj.widget = widget;
            dataObj.offsetX = -45;
            dataObj.offsetY = 130;
            dataObj.arrow = 'rb';
            dataObj.infoStr = cc.vv.lan.MATCH_LAN[71];
            dataObj.bInfoImg = false;
            dataObj.chickIdx = 1;
            dataObj.nextStepIdx = 1;
            dataObj.nextCallFunc = function () {
                cc.vv.audioMgr.playClickedBgm();
                self.doneGuideStep();
            },

                this.guideStepConfigureArr[4] = dataObj;
        },

        //06_引导点击进入比赛
        setConfigure_5: function () {
            var self = this;
            var widget = cc.find('Canvas/guide_match_canvas/right/match_enter_btn');

            var dataObj = {};
            dataObj.typ = 1;
            dataObj.widget = widget;
            dataObj.offsetX = -45;
            dataObj.offsetY = 140;
            dataObj.arrow = 'rb';
            dataObj.infoStr = cc.vv.lan.MATCH_LAN[72];
            dataObj.bInfoImg = false;
            dataObj.chickIdx = 1;
            dataObj.nextStepIdx = 1;
            dataObj.nextCallFunc = function () {
                cc.vv.audioMgr.playClickedBgm();
                var guideCanvasNode = cc.find('Canvas/guide_match_canvas');
                if (guideCanvasNode) {
                    guideCanvasNode.destroy();
                }
                // cc.find('Canvas/guide_match_canvas').destroy();
                cc.eventManager.pauseTarget(cc.find('Canvas'), true);
                cc.vv.utils.createPrefabByUrl(cc.vv.const.URL_GUIDE_MJ_BATTLE, null, function () {
                    self.doneGuideStep();
                });
            },
                dataObj.holeCallFunc = dataObj.nextCallFunc;
            this.guideStepConfigureArr[5] = dataObj;
        },

        //07_玩家进入房间匹配比赛
        setConfigure_6: function () {
            var self = this;
            var widget = cc.find('Canvas/guide_mj_battle_node/guideNode');

            var dataObj = {};
            dataObj.typ = 1;
            dataObj.widget = widget;
            dataObj.offsetX = 20;
            dataObj.offsetY = -200;
            dataObj.arrow = 'rt';
            dataObj.infoStr = cc.vv.lan.MATCH_LAN[73];
            dataObj.bInfoImg = false;
            dataObj.chickIdx = 2;
            dataObj.nextStepIdx = 1;
            dataObj.nextCallFunc = function () {
                cc.vv.audioMgr.playClickedBgm();
                var script = widget.parent.getComponent("GuideMJBattle");
                script.onHideCountDownComponent();
                self.doneGuideStep();
            },

                this.guideStepConfigureArr[6] = dataObj;
        },

        //08_引导进入最后一局比赛
        setConfigure_7: function () {
            var self = this;
            var widget = cc.find('Canvas/guide_mj_battle_node/guideNode');

            var dataObj = {};
            dataObj.typ = 1;
            dataObj.widget = widget;
            dataObj.offsetX = -45;
            dataObj.offsetY = 0;
            dataObj.arrow = 'rt';
            dataObj.infoStr = cc.vv.lan.MATCH_LAN[74];
            dataObj.bInfoImg = false;
            dataObj.chickIdx = 2;
            dataObj.nextStepIdx = 2;
            dataObj.nextCallFunc = function () {
                cc.vv.audioMgr.playClickedBgm();
                var script = widget.parent.getComponent("GuideMJBattle");
                script.onShowGuideBattleCardComponent();
                cc.find("Canvas/guide_node").active = false;
                self.doneGuideStep();
            },
                this.guideStepConfigureArr[7] = dataObj;
        },

        //09_引导玩家点击抢金
        setConfigure_8: function () {
            var self = this;
            var widget = cc.find('Canvas/guide_mj_battle_node/guide_card/game/bottom/MyCmd/opt_gold_camp');
            var dataObj = {};
            dataObj.typ = 1;
            dataObj.widget = widget;
            dataObj.offsetX = -80;
            dataObj.offsetY = 180;
            dataObj.arrow = 'rb';
            dataObj.infoStr = cc.vv.lan.MATCH_LAN[83];
            dataObj.bInfoImg = false;
            dataObj.chickIdx = 2;
            dataObj.nextStepIdx = 0;
            dataObj.holeCallFunc = function () {
                cc.vv.audioMgr.playClickedBgm();
                var script = cc.find("Canvas/guide_mj_battle_node").getComponent("GuideMJBattle");
                script.onHideGuideBattleCardComponent();
                cc.vv.utils.createPrefabByUrl(cc.vv.const.URL_GUIDE_MJ_ROUND_RESULT, null, function (node) {
                    node.getComponent("GuideMJRoundResult")._callback = self.doneGuideStep();
                });
            },
                this.guideStepConfigureArr[8] = dataObj;
        },

        // 10_引导玩家点击回合结算确定按钮
        setConfigure_9: function () {
            var self = this;
            var widget = cc.find('Canvas/guide_mj_round_result_node/continue_btn');
            var dataObj = {};
            dataObj.typ = 1;
            dataObj.widget = widget;
            dataObj.offsetX = 0;
            dataObj.offsetY = 200;
            dataObj.arrow = 'rb';
            dataObj.infoStr = cc.vv.lan.MATCH_LAN[88];
            dataObj.bInfoImg = false;
            dataObj.chickIdx = 2;
            dataObj.nextStepIdx = 1;
            dataObj.holeCallFunc = function () {
                cc.vv.audioMgr.playClickedBgm();
                var script = cc.find("Canvas/guide_mj_battle_node").getComponent("GuideMJBattle");
                script.onHideGuideBattleCardComponent();
                var guideMJRoundResultNode = cc.find("Canvas/guide_mj_round_result_node");
                if (guideMJRoundResultNode) {
                    guideMJRoundResultNode.destroy();
                }
                // cc.find("Canvas/guide_mj_round_result_node").destroy();
                cc.vv.utils.createPrefabByUrl(cc.vv.const.URL_GUIDE_MJ_COMPLETED, null, function () {
                    self.doneGuideStep();
                });
            },
                dataObj.nextCallFunc = dataObj.holeCallFunc;
            this.guideStepConfigureArr[9] = dataObj;
        },

        //11_引导玩家点击挑战成功返回大厅按钮
        setConfigure_10: function () {
            var self = this;
            var widget = cc.find('Canvas/guide_mj_battle_completed/back_btn');
            var dataObj = {};
            dataObj.typ = 1;
            dataObj.widget = widget;
            dataObj.offsetX = 20;
            dataObj.offsetY = 130;
            dataObj.arrow = 'rb';
            dataObj.infoStr = cc.vv.lan.MATCH_LAN[75];
            dataObj.bInfoImg = false;
            dataObj.chickIdx = 2;
            dataObj.nextStepIdx = 1;
            dataObj.nextCallFunc = function () {
                cc.vv.audioMgr.playClickedBgm();
                self.onSendGuideStepEvent(1);
                var guideMJBattleCompletedNode = cc.find('Canvas/guide_mj_battle_completed');
                var guideMJBattleNode = cc.find('Canvas/guide_mj_battle_node');
                if (guideMJBattleCompletedNode) {
                    guideMJBattleCompletedNode.destroy();
                }
                if (guideMJBattleNode) {
                    guideMJBattleNode.destroy();
                }
                // cc.find('Canvas/guide_mj_battle_completed').destroy();
                // cc.find('Canvas/guide_mj_battle_node').destroy();
                cc.vv.utils.createPrefabByUrl(cc.vv.const.URL_GUIDE_MJ_AWARD, null, function (node) {
                    node.getComponent("GuideMJAward")._callback = self.doneGuideStep();
                });
            },
                dataObj.holeCallFunc = dataObj.nextCallFunc;
            this.guideStepConfigureArr[10] = dataObj;
        },

        //12_引导玩家在结算分享界面中点击分享按钮
        setConfigure_11: function () {
            var self = this;
            var widget = cc.find('Canvas/guide_mj_match_award/share_btn');
            var dataObj = {};
            dataObj.typ = 1;
            dataObj.widget = widget;
            dataObj.offsetX = 20;
            dataObj.offsetY = 160;
            dataObj.arrow = 'rb';
            dataObj.infoStr = cc.vv.lan.MATCH_LAN[76];
            dataObj.bInfoImg = false;
            dataObj.chickIdx = 2;
            dataObj.nextStepIdx = 1;
            dataObj.nextCallFunc = function () {
                cc.vv.audioMgr.playClickedBgm();
                self.doneGuideStep();
            },
                dataObj.holeCallFunc = dataObj.nextCallFunc;

            this.guideStepConfigureArr[11] = dataObj;
        },

        //13_引导玩家点击结算分享界面的返回按钮
        setConfigure_12: function () {
            var self = this;
            var widget = cc.find('Canvas/guide_mj_match_award/back_btn');
            var dataObj = {};
            dataObj.typ = 1;
            dataObj.widget = widget;
            dataObj.offsetX = 395;
            dataObj.offsetY = -90;
            dataObj.arrow = 'lt';
            dataObj.infoStr = cc.vv.lan.MATCH_LAN[77];
            dataObj.bInfoImg = false;
            dataObj.chickIdx = 2;
            dataObj.nextStepIdx = 1;
            dataObj.nextCallFunc = function () {
                cc.vv.audioMgr.playClickedBgm();
                var guideMJMatchAwardNode = cc.find("Canvas/guide_mj_match_award");
                if (guideMJMatchAwardNode) {
                    guideMJMatchAwardNode.destroy();
                }
                // cc.find("Canvas/guide_mj_match_award").destroy();
                self.doneGuideStep();
            },
                dataObj.holeCallFunc = dataObj.nextCallFunc;

            this.guideStepConfigureArr[12] = dataObj;
        },

        //14_引导玩家点击大厅中余额提现窗口
        setConfigure_13: function () {
            var self = this;
            var widget = cc.find('Canvas/left/panel_1');
            var dataObj = {};
            dataObj.typ = 1;
            dataObj.widget = widget;
            dataObj.offsetX = 500;
            dataObj.offsetY = -150;
            dataObj.arrow = 'lt';
            dataObj.infoStr = cc.vv.lan.MATCH_LAN[78];
            dataObj.bInfoImg = false;
            dataObj.chickIdx = 1;
            dataObj.nextStepIdx = 1;
            dataObj.nextCallFunc = function () {
                cc.vv.audioMgr.playClickedBgm();
                cc.vv.utils.createPrefabByUrl(cc.vv.const.URL_DRAW_MONEY, null, function () {
                    self.doneGuideStep();
                });
            },
                dataObj.holeCallFunc = dataObj.nextCallFunc;
            this.guideStepConfigureArr[13] = dataObj;
        },

        //15_引导玩家点击提现界面提现按钮
        setConfigure_14: function () {
            var self = this;
            var widget = cc.find('Canvas/draw_money/draw_bonus_btn');
            var dataObj = {};
            dataObj.typ = 1;
            dataObj.widget = widget;
            dataObj.offsetX = 120;
            dataObj.offsetY = -140;
            dataObj.arrow = 'rt';
            dataObj.infoStr = cc.vv.lan.MATCH_LAN[79];
            dataObj.bInfoImg = false;
            dataObj.chickIdx = 1;
            dataObj.nextStepIdx = 1;
            dataObj.nextCallFunc = function () {
                cc.vv.audioMgr.playClickedBgm();
                cc.vv.utils.createPrefabByUrl(cc.vv.const.URL_DRAW_MONEY_TUTORIAL, null, function () {
                    self.doneGuideStep();
                });
            },
                dataObj.holeCallFunc = dataObj.nextCallFunc;
            this.guideStepConfigureArr[14] = dataObj;
        },

        //16_提现教程  教程部分高亮
        setConfigure_15: function () {
            var self = this;
            var widget = cc.find('Canvas/draw_money_tutorial/tutorial_content');
            var dataObj = {};
            dataObj.typ = 1;
            dataObj.widget = widget;
            dataObj.offsetX = -260;
            dataObj.offsetY = -255;
            dataObj.arrow = 'rt';
            dataObj.infoStr = cc.vv.lan.MATCH_LAN[80];
            dataObj.bInfoImg = false;
            dataObj.chickIdx = 1;
            dataObj.nextStepIdx = 1;
            dataObj.nextCallFunc = function () {
                cc.vv.audioMgr.playClickedBgm();
                self.doneGuideStep();
            },
                this.guideStepConfigureArr[15] = dataObj;
        },

        //17_提现教程关注公众号按钮高亮
        setConfigure_16: function () {
            var self = this;
            var widget = cc.find('Canvas/draw_money_tutorial/tutorial_down/concern_btn');
            var dataObj = {};
            dataObj.typ = 1;
            dataObj.widget = widget;
            dataObj.offsetX = -80;
            dataObj.offsetY = 150;
            dataObj.arrow = 'rb';
            dataObj.infoStr = cc.vv.lan.MATCH_LAN[80];
            dataObj.bInfoImg = false;
            dataObj.chickIdx = 1;
            dataObj.nextStepIdx = 1;
            dataObj.nextCallFunc = function () {
                cc.vv.audioMgr.playClickedBgm();
                cc.vv.utils.createPrefabByUrl(cc.vv.const.URL_WECHAT_CONCERN, null, function (node) {
                    node.getComponent("Help")._callback = self.doneGuideStep();
                });
            },
                dataObj.holeCallFunc = dataObj.nextCallFunc;
            this.guideStepConfigureArr[16] = dataObj;
        },

        //18_弹出快速关注公众号界面  并高亮教程部分
        setConfigure_17: function () {
            var self = this;
            var widget = cc.find('Canvas/wechat_concern/panel');
            var dataObj = {};
            dataObj.typ = 1;
            dataObj.widget = widget;
            dataObj.offsetX = 100;
            dataObj.offsetY = -260;
            dataObj.arrow = 'rt';
            dataObj.infoStr = cc.vv.lan.MATCH_LAN[90];
            dataObj.bInfoImg = false;
            dataObj.chickIdx = 1;
            dataObj.nextStepIdx = 1;
            dataObj.nextCallFunc = function () {
                cc.vv.audioMgr.playClickedBgm();
                self.doneGuideStep();
            },
                this.guideStepConfigureArr[17] = dataObj;
        },

        //19_高亮快速关注公众号界面指示箭头部分
        setConfigure_18: function () {
            var widget = cc.find('Canvas/wechat_concern/arrow_spr');
            var pos = widget.parent.convertToWorldSpaceAR(cc.p(widget.x, widget.y))

            var dataObj = {};
            dataObj.typ = 2;
            dataObj.x = pos.x - 157;
            dataObj.y = pos.y;
            dataObj.width = widget.width;
            dataObj.height = widget.height;
            dataObj.offsetX = -120;
            dataObj.offsetY = -130;
            dataObj.arrow = 'rt';
            dataObj.infoStr = cc.vv.lan.MATCH_LAN[81];
            dataObj.bInfoImg = false;
            dataObj.chickIdx = 1;
            dataObj.nextStepIdx = 1;

            var self = this;
            dataObj.nextCallFunc = function () {
                cc.vv.audioMgr.playClickedBgm();
                var concrenNode = cc.find('Canvas/wechat_concern');
                var drawMoneyNode = cc.find('Canvas/draw_money');
                var drawMoneyTutorialNode = cc.find('Canvas/draw_money_tutorial');
                if (concrenNode) {
                    concrenNode.destroy();
                }
                if (drawMoneyNode) {
                    drawMoneyNode.destroy();
                }
                if (drawMoneyTutorialNode) {
                    drawMoneyTutorialNode.destroy();
                }
                // cc.find('Canvas/wechat_concern').destroy();
                // cc.find('Canvas/draw_money').destroy();
                // cc.find('Canvas/draw_money_tutorial').destroy();
                cc.vv.utils.createPrefabByUrl(cc.vv.const.URL_GUIDE_CLICK_ANIM, null, function () {
                    self.doneGuideStep();
                });
            },
                this.guideStepConfigureArr[18] = dataObj;
        },

        //20_引导玩家进行真实报名
        setConfigure_19: function () {
            var self = this;
            var widget = cc.find('Canvas/right/match_enroll_btn');
            var dataObj = {};
            dataObj.typ = 1;
            dataObj.widget = widget;
            dataObj.offsetX = 35;
            dataObj.offsetY = 150;
            dataObj.arrow = 'rb';
            dataObj.infoStr = cc.vv.lan.MATCH_LAN[82];
            dataObj.bInfoImg = false;
            dataObj.chickIdx = 0;
            dataObj.nextStepIdx = 0;
            dataObj.maskBgOpacity = 0;
            dataObj._bHideMask = true;
            dataObj.holeCallFunc = function () {
                self.onSendGuideStepEvent(2);
                var guideClickNode = cc.find("Canvas/guide_clickAnim");
                if (guideClickNode) {
                    guideClickNode.destroy();
                }
                // cc.find("Canvas/guide_clickAnim").destroy();
                cc.find("Canvas").getComponent("Match").onEnrollMatchEvent();
                cc.eventManager.resumeTarget(cc.find("Canvas"), true);
            },
                dataObj.maskCallFunc = function () {
                    self.onSendGuideStepEvent(2);
                    cc.eventManager.resumeTarget(cc.find("Canvas"), true);
                    var guideClickNode = cc.find("Canvas/guide_clickAnim");
                    if (guideClickNode) {
                        guideClickNode.destroy();
                    }
                    // cc.find("Canvas/guide_clickAnim").destroy();
                },
                dataObj.nextCallFunc = dataObj.maskCallFunc;
            this.guideStepConfigureArr[19] = dataObj;
        },
        //end
    },


});
