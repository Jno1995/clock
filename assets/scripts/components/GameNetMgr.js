// var DRoom = require("DRoom");
// var DMatch = require("DMatch");
// var PacketWriter = require("PacketWriter");

// 战斗事件类
cc.Class({
    extends: cc.Component,

    properties: {
        dataEventHandler: null,
        roomData: null,
        matchData: null,
        reconnectAnims: null,
    },

    dispatchEvent(event, data) {
        if (this.dataEventHandler) {
            this.dataEventHandler.emit(event, data);
        }
    },

    init() {

        this.roomData = new DRoom();
        this.matchData = new DMatch();
        this.initEventHandlers();
    },

    initEventHandlers() {

        var self = this;
        cc.vv.gameEvent.addEventHandler(cc.vv.gameEvent.EVENT_WSS_OPEN, function () {
            // if (self.reconnectAnims != null) {
            //     self.reconnectAnims.destroy();
            //     self.reconnectAnims = null;
            // }
            // 链接成功之后，如果玩家id>0表示重连
            self.tryReconnectLogicServer();
        }, this);

        cc.vv.gameEvent.addEventHandler(cc.vv.gameEvent.EVENT_WSS_CLOSED, function () {
            // if (self.reconnectAnims == null) {
            //     cc.loader.loadRes(cc.vv.const.URL_RECONNECTION_ANIMS, function (err, prefab) {
            //         self.reconnectAnims = cc.instantiate(prefab);
            //         cc.director.getScene().getChildByName("Canvas").addChild(self.reconnectAnims);
            //     });
            // }
        }, this);

        cc.vv.gameEvent.addEventHandler(cc.vv.gameEvent.EVENT_ENTER_FOREGROUND, function (data) {
            cc.vv.audioMgr.playBGM();
            cc.vv.socketMgr.checkNetState(); // 检测网络状态
        }, this);

        cc.vv.gameEvent.addEventHandler(cc.vv.gameEvent.EVENT_ENTER_BACKGROUND, function (data) {
            cc.vv.audioMgr.stopBGM();
        }, this);

        cc.vv.gameEvent.addEventHandler(cc.vv.gameEvent.EVENT_AUDIO_INTERRUPTION_BEGIN, function (data) {
            cc.vv.audioMgr.stopBGM();
        }, this);

        cc.vv.gameEvent.addEventHandler(cc.vv.gameEvent.EVENT_AUDIO_INTERRUPTION_END, function (data) {
            cc.vv.audioMgr.playBGM();
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_104", function (data) {
            // console.log(data);
            if (data['resultCode'] == 0) {

                // 单场景 不需要切换

                // var curSceneName = cc.director.getScene().name;

                // switch (data['currentStatus']) {
                //     case 1:
                //         if (!cc.vv.gameNetMgr.roomData.bDuringSettlement) {
                //             if (curSceneName != 'match'){
                //                 cc.director.loadScene('match');
                //             }
                //         }
                //         break;
                //     case 2:
                //     case 3:
                //     case 4:
                //         if (curSceneName != 'match'){
                //             cc.director.loadScene('match');
                //         }
                //         break;
                //     default:
                //         console.log('_PACKET_104 status error');
                //         break;
                // }

                if (cc.vv.wxHelper._queryData != null) {
                    var data = cc.vv.wxHelper._queryData;
                    if ("undefined" !== typeof data
                        && "undefined" !== typeof data.inviterId
                        && "undefined" !== typeof data.inviterName) {
                        var inviterId = parseInt(data.inviterId);
                        var inviterName = data.inviterName;
                        var inviterMatchId = data.inviterMatchId;
                        var pw = new PacketWriter();
                        pw.writeid(cc.vv.packid.PACKETID_210);
                        pw.writeu8(inviterId);
                        pw.writes(inviterName);
                        if ("undefined" !== typeof inviterMatchId) {
                            pw.writeu4(inviterMatchId);
                        } else {
                            pw.writeu4(0);
                        }
                        cc.vv.socketMgr.bufferPack(pw.getdata());
                    }
                } else {
                    console.log("[ queryData is Null ]");
                }
            }
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_230", function (data) {
            // console.log(data)
            cc.vv.lan.FZMJ_NOTIVE = data["noticeContent"];
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_240", function (data) {
            console.log("[ => callback 240 ]");
            console.log(data.language);

            // test code
            // data.language = '{"GOLD_ENTER_CONDITION_1":2,"MATCH_LAN.128":1}';

            // data.language = '[{"a":1}]';


            // 兼容上一个版本的错误的配置
            if (data.language.length > 0 && data.language.substr(0, 1) == '[') {
                console.log('start with [');
                return;
            }

            var fixlan = JSON.parse(data.language);
            console.log(fixlan);

            console.log(typeof fixlan);

            for (var k in fixlan) {

                var v = fixlan[k];
                var klen = k.length;

                var idx = k.lastIndexOf(".");

                console.log('idx ' + idx)

                if (idx != -1) {

                    // 数组key

                    var front = k.substring(0, idx);
                    var back = k.substring(idx + 1, klen);

                    console.log('front = ' + front);
                    console.log(' back = ' + back);

                    cc.vv.lan[front][parseInt(back)] = v;
                }
                else {

                    // 单key
                    cc.vv.lan[k] = v;
                }
            }
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_246", function (data) {
            console.log("[ => callback 246 ]");
            console.log(data);
            if (data.const == "") {
                console.log('  246  Object  is  null');
                return;
            }
            var fixconst = JSON.parse(data.const);

            console.log(fixconst);

            console.log(typeof fixconst);

            for (var k in fixconst) {

                var v = fixconst[k];
                var klen = k.length;

                var idx = k.lastIndexOf(".");

                console.log('idx ' + idx)

                if (idx != -1) {

                    // 数组key

                    var front = k.substring(0, idx);
                    var back = k.substring(idx + 1, klen);

                    console.log('front = ' + front);
                    console.log(' back = ' + back);

                    cc.vv.const[front][parseInt(back - 1)] = Number(v);
                }
                else {
                    cc.vv.const[k] = v;
                }
            }


        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_249", function (data) {
            console.log("[ => callback 249 ]");
            console.log(data);
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_303", function (data) {
            // console.log(data);
            if (data.resultCode == 0) {
                if (cc.vv.gameNetMgr.roomData.seatIndex != cc.vv.gameNetMgr.roomData.zhuangIndex) {
                    self.dispatchEvent(cc.vv.gameEvent.EVENT_ROOM_CLOSED);
                }
            }
            else {
                console.log("_PACKET_303 respond. code = " + data.resultCode);
            }
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_309", function (data) {
            // console.log(data);
            self.roomData.readPacket309(data);
            self.dispatchEvent(cc.vv.gameEvent.EVENT_ROOM_VOTE_DISBAND);
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_310", function (data) {
            // console.log(data);
            self.roomData.readPacket310(data);
            self.dispatchEvent(cc.vv.gameEvent.EVENT_GAME_DISBAND_SETTLEMENT);
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_311", function (data) {
            // console.log(data);
            if (self.roomData.gameBegin) {
                // cc.vv.gameNetMgr.roomData.clean();
                self.dispatchEvent(cc.vv.gameEvent.EVENT_ROOM_CLOSED);
            } else {
                if (self.roomData.zhuangIndex == self.roomData.seatIndex) {
                    cc.vv.utils.showDialogOK(cc.vv.lan.FZMJ_LAN[38], function () {
                        cc.vv.gameNetMgr.roomData.clean();
                        cc.vv.gameNetMgr.dispatchEvent(cc.vv.gameEvent.EVENT_ROOM_CLOSED);
                    });
                } else {
                    self.dispatchEvent(cc.vv.gameEvent.EVENT_ROOM_CLOSED);
                }
            }
            self.roomData.gameBegin = true;
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_315", function (data) {
            // console.log("=> gameEvent callback 315");
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_317", function (data) {
            // console.log("=> gameEvent callback 317");
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_318", function (data) {
            // console.log("=> gameEvent callback 318");
            // console.log(cc.vv.gameEvent.EVENT_INTERACTIVE);
            self.dispatchEvent(cc.vv.gameEvent.EVENT_INTERACTIVE, data);
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_401", function (data) {
            // console.log(data);
            self.roomData.readPacket401(data);
            self.dispatchEvent(cc.vv.gameEvent.EVENT_GAME_BEGIN);
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_402", function (data) {
            // console.log(data);
            self.roomData.readPacket402(data);
            self.dispatchEvent(cc.vv.gameEvent.EVENT_MJ_NEWCMD, data.pindex);
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_403", function (data) {
            // console.log(data);
            self.dispatchEvent(cc.vv.gameEvent.EVENT_MJ_CMDRESPOND, data.resultCode);
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_404", function (data) {
            // console.log(data);
            var pai = 0;
            if (data.type != 255 && data.value != 255) {
                pai = cc.vv.const.MJTYPE_MULTI * data.type + data.value;
            }
            self.doMOPAI(data.direction, pai);
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_405", function (data) {
            // console.log(data);

            self.doOptResult(data);

            // self.roomData.initPacket401(data);
            // self.dispatchEvent(cc.vv.gameEvent.EVENT_GAME_BEGIN);
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_406", function (data) {
            // console.log(data);
            // self.roomData.initPacket406(data);
            // self.dispatchEvent(cc.vv.gameEvent.EVENT_GAME_BEGIN);
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_407", function (data) {
            // console.log(data);
            self.roomData.readPacket407(data);
            self.dispatchEvent(cc.vv.gameEvent.EVENT_GAME_SETTLEMENT);
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_410", function (data) {
            // console.log(data);
            self.roomData.readPacket410(data);
            self.dispatchEvent(cc.vv.gameEvent.EVENT_MEMBER_CHANGE);
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_411", function (data) {
            // console.log(data);
            self.doKAIJIN(data);
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_413", function (data) {
            // console.log(data);
            self.roomData.readPacket413(data);
            self.dispatchEvent(cc.vv.gameEvent.EVENT_MJ_MOON);
        }, this);

        // 福州麻将听金坎状态
        cc.vv.gameEvent.addEventHandler("_PACKET_434", function (data) {
            console.log(data);
            self.roomData.readPacket434(data);
            self.dispatchEvent(cc.vv.gameEvent.EVENT_MJ_GOLDCAMP, data.direction);
        }, this);

        //////////////////////////// match ////////////////////////////////

        // 
        cc.vv.gameEvent.addEventHandler("_PACKET_909", function (data) {
            // console.log(data);

            if (data.playerId == cc.vv.myself.playerId) {

                if (data.autoState > 0) {
                    cc.vv.roomData.bAutomatic = true;
                }
                else {
                    cc.vv.roomData.bAutomatic = false;
                }

                self.dispatchEvent(cc.vv.gameEvent.EVENT_AUTOMATIC_CHANGED);
            }

        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_951", function (data) {
            console.log(data);
            self.matchData.readPacket951(data);
            // console.log(self.matchData);
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_953", function (data) {
            console.log(data);
            self.matchData.readPacket953(data);
            // console.log(self.matchData);
            cc.vv.gameEvent.dispatchEvent(cc.vv.gameEvent.EVENT_MATCH_STATE_CHANGED, data.state);

        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_956", function (data) {
            console.log(data);
            self.matchData.readPacket956(data);
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_957", function (data) {
            console.log(data);

            if (data.resultCode != 0) {
                cc.vv.utils.showDialogOK("continues. errcode=" + data.resultCode, null, false);
            }

        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_958", function (data) {
            console.log(data);
            self.matchData.readPacket958(data);
            cc.vv.matchData.gamePrepareShareArr = [];
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_959", function (data) {
            console.log(data);
            self.matchData.readPacket959(data);
            cc.vv.gameEvent.dispatchEvent(cc.vv.gameEvent.EVENT_MATCH_AWARD_SHARE);
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_961", function (data) {
            console.log(" => PACKET_961");
            console.log(data);
            cc.vv.matchData.gamePrepareShareArr.push(data);
            cc.vv.matchData.curScore += data.fuelValue;

            // var mjBattleNode = cc.find('Canvas/mj_battle_node');
            // if (mjBattleNode) {
            //     mjBattleNode.getChildByName("match_award_help").getComponent("MJAwardHelp").onCreateAwardItemEvent(data);
            // } 
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_965", function (data) {
            console.log("=> PACKET_965");
            console.log(data);
            cc.vv.matchData.gamePrepareShareArr = data.gamePrepareShareLen_child;
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_1001", function (data) {
            cc.vv.myself.largessGoldValue = data.gold;
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_1003", function (data) {
            console.log("=> PACKET_1003");
            console.log(data);
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_1004", function (data) {
            console.log("=> PACKET_1004");
            console.log(data);

            cc.vv.matchData.goldFieldId = data.goldGameID;
            cc.vv.matchData.goldFieldState = data.state;

            // 处理重连时，玩家选择的金币场被清空，此时从服务器读取 
            if (cc.vv.matchData.goldPlayerEnterId == 0) {
                cc.vv.matchData.goldPlayerEnterId = cc.vv.matchData.goldFieldId;
            }

        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_1007", function (data) {
            console.log("=> PACKET_1007");
            console.log(data);

            self.roomData.readPacket1007(data);
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_1005", function (data) {
            console.log("=> PACKET_1005");
            console.log(data);
            for (var i = 0; i < data.goldGameNum_child.length; i++) {
                var gameid = data.goldGameNum_child[i].goldGameID;
                var onlineNum = data.goldGameNum_child[i].playerNum;
                cc.vv.matchData.goldFieldOnlines[gameid - 1] = onlineNum;
            }
            console.log(cc.vv.matchData.goldFieldOnlines);
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_1010", function (data) {
            console.log("=> PACKET_1010");
            console.log(data);

            self.roomData.readPacket1010(data);
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_1011", function (data) {

        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_1016", function (data) {
            cc.vv.myself.redPacketTag = true;
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_1017", function (data) {
            console.log("=> gameEvent callBack 1017");
            if (data.resultCode == 0) {
                cc.vv.utils.showDialogOK(cc.vv.lan.MATCH_LAN[127].format(data.ticketAward), function () {
                    this.node.destroy();
                }, false, cc.vv.enum.EnumLabelHorizontalAlign.CENTER);
            }
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_1020", function (data) {
            console.log("=> gameEvent callBack 1020");
            console.log(data);
            for (let i = 0; i < data.goldMatchInfoLen; i++) {
                var infoData = data.goldMatchInfoLen_child[i];
                cc.vv.matchData.goldMatchPacketValueArr.push(infoData.awardBonus / 100);
                if (infoData.goldMatchType == cc.vv.enum.EnumGoldGameType.EGGT_LOW) {
                    cc.vv.myself.sprogGoldMatchTimes = infoData.playedTimes;
                } else if (infoData.goldMatchType == cc.vv.enum.EnumGoldGameType.EGGT_MIDDLE) {
                    cc.vv.myself.richGoldMatchTimes = infoData.playedTimes;
                } else if (infoData.goldMatchType == cc.vv.enum.EnumGoldGameType.EGGT_HIGHT) {
                    cc.vv.myself.masterGoldMatchTimes = infoData.playedTimes;
                }
            }
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_1021", function (data) {
            console.log("=> PACKET_1021");
            console.log(data);
            cc.vv.myself.isFreeGold = true;
        }, this);

        cc.vv.gameEvent.addEventHandler("_PACKET_1022", function (data) {
            console.log("=> PACKET_1022");
            cc.vv.matchData.goldMangerArr = [];
            cc.vv.const.GOLD_RISING_POURING = [];
            cc.vv.const.GOLD_ENTER_CONDITION = [];
            cc.vv.matchData.goldMatchOpenIDArr = [];
            cc.vv.matchData.goldMangerArr = data.goldMatchLen_child;
            var goldMangerArr = cc.vv.matchData.goldMangerArr;
            console.log(goldMangerArr);
            for (let i = 0; i < data.goldMatchLen; i++) {
                cc.vv.const.GOLD_RISING_POURING.push(goldMangerArr[i].castBottom);
                cc.vv.const.GOLD_ENTER_CONDITION.push({ min: goldMangerArr[i].lowerLimit, max: goldMangerArr[i].superiorLimit });
                if (data.goldMatchLen_child[i].isOpen > 0) {
                    cc.vv.matchData.goldMatchOpenIDArr.push(goldMangerArr[i].goldMatchType);
                }
            }
        }, this);
    },

    // 操作结果
    doOptResult(data) {

        var MJTYPE_MULTI = cc.vv.const.MJTYPE_MULTI;

        console.log("receive opt, seat: " + data.direction + " opt:" + cc.vv.lan.MJOPT_NAME[data.option]);
        console.log(data);

        var opt = data.option;

        var pai1 = MJTYPE_MULTI * data.pai1_type + data.pai1_value;
        var pai2 = MJTYPE_MULTI * data.pai2_type + data.pai2_value;
        var pai3 = MJTYPE_MULTI * data.pai3_type + data.pai3_value;

        if (opt == cc.vv.enum.EnumCmdType.MJOPT_BUHUA) {
            var huas = [];
            var bupais = [];
            var kaiju = data.z_isFirstBuhua;

            var optionHua_child = data.optionHua_child[0];

            for (var i = 0; i < optionHua_child.huaCard_Num_child.length; i++) {
                huas.push(MJTYPE_MULTI * optionHua_child.huaCard_Num_child[i].huaCard_type + optionHua_child.huaCard_Num_child[i].huaCard_value);
            }
            for (var i = 0; i < optionHua_child.putCard_Num_child.length; i++) {
                bupais.push(MJTYPE_MULTI * optionHua_child.putCard_Num_child[i].putCard_type + optionHua_child.putCard_Num_child[i].putCard_value);
            }
            this.doBUHUA(data.direction, huas, bupais, kaiju);
        }
        else if (opt == cc.vv.enum.EnumCmdType.MJOPT_CHI) {
            this.doCHI(data.direction, pai1, pai2, pai3);
        }
        else if (opt == cc.vv.enum.EnumCmdType.MJOPT_PENG) {
            this.doPENG(data.direction, pai1);
        }
        else if (opt == cc.vv.enum.EnumCmdType.MJOPT_GANG) {
            this.doGANG(data.direction, pai1);
        }
        else if (opt == cc.vv.enum.EnumCmdType.MJOPT_ANGANG) {
            this.doANGANG(data.direction, pai1);
        }
        else if (opt == cc.vv.enum.EnumCmdType.MJOPT_JIAGANG) {
            this.doJIAGANG(data.direction, pai1);
        }
        else if (opt == cc.vv.enum.EnumCmdType.MJOPT_DA) {
            this.roomData.lastDAIndex = data.direction;
            this.doDA(data.direction, pai1);
        }
        else if (opt == cc.vv.enum.EnumCmdType.MJOPT_GUO1) {
            this.roomData.lastDAIndex = data.direction;
            this.doDA(data.direction, pai1);
        }
        else if (opt == cc.vv.enum.EnumCmdType.MJOPT_DA_T) {
            this.roomData.lastDAIndex = data.direction;
            this.doDA(data.direction, pai1);
        }
        else if (opt == cc.vv.enum.EnumCmdType.MJOPT_GUO2) {
            this.roomData.lastDAIndex = data.direction;
            this.doDA(data.direction, pai1);
        }
        else if (opt == cc.vv.enum.EnumCmdType.MJOPT_TING) {
            this.roomData.lastDAIndex = data.direction;
            this.doTING(data.direction, pai1);
        }
    },

    doKAIJIN(data) {

        var MJTYPE_MULTI = cc.vv.const.MJTYPE_MULTI;
        var king = MJTYPE_MULTI * data.goldType + data.goldValue;
        this.roomData.king = king;

        var zhuangIndex = this.roomData.zhuangIndex;
        var seatData = this.roomData.seats[zhuangIndex];

        for (var i = 0; i < data.flowerNum_child.length; i++) {
            var huapai = MJTYPE_MULTI * data.flowerNum_child[i].type + data.flowerNum_child[i].value;
            seatData.huas.push(huapai);
        }

        var oldNum = this.roomData.remainCard;

        this.roomData.subRemainCard(data.flowerNum_child.length + 1);  // 开金的话 + 金牌

        var newNum = this.roomData.remainCard;

        console.log('kaijin bupai len=' + data.flowerNum_child.length + 1);
        console.log('sub remain card x' + (data.flowerNum_child.length + 1) + ' old=' + oldNum + ' new=' + newNum + ' opt=kaiju buhua');

        this.dispatchEvent(cc.vv.gameEvent.EVENT_MJ_KAIJIN, { seatIndex: zhuangIndex, king: king, huacount: data.flowerNum_child.length });
    },

    doBUHUA(seatIndex, huas, bupais, kaiju) {

        var myseatIndex = this.roomData.seatIndex;
        var seatData = this.roomData.seats[seatIndex];
        // 花牌从手上移动到花堆
        for (var i = 0; i < huas.length; i++) {
            if (seatIndex == myseatIndex) {
                var idx = seatData.holds.indexOf(huas[i]);
                if (idx != -1) {
                    seatData.holds.splice(idx, 1);
                }
            }
            seatData.huas.push(huas[i]);
        }
        // 补充手牌
        if (seatIndex == myseatIndex) {
            for (var i = 0; i < bupais.length; i++) {
                seatData.holds.push(bupais[i]);
            }
        }

        var oldNum = this.roomData.remainCard;

        this.roomData.subRemainCard(huas.length);

        var newNum = this.roomData.remainCard;

        console.log('bupai len=' + huas.length);
        console.log('sub remain card x' + huas.length + ' old=' + oldNum + ' new=' + newNum + ' opt=buhua');

        this.dispatchEvent(cc.vv.gameEvent.EVENT_MJ_BUHUA, { seatIndex: seatIndex, huas: huas, bupais: bupais, kaiju: kaiju });
    },

    doCHI(seatIndex, pai1, pai2, pai3) {

        // pai2是吃进来的 pai1,pai3是手上的

        var myseatIndex = this.roomData.seatIndex;
        var seatData = this.roomData.seats[seatIndex];
        // 移除手牌

        if (seatIndex == myseatIndex) {
            var idx = -1;
            idx = seatData.holds.indexOf(pai1);
            if (idx != -1) {
                seatData.holds.splice(idx, 1);
            }
            idx = seatData.holds.indexOf(pai3);
            if (idx != -1) {
                seatData.holds.splice(idx, 1);
            }
        }
        else {
            seatData.holds.splice(0, 1);
            seatData.holds.splice(0, 1);
        }

        // 添加吃牌
        seatData.chis.push(pai1);
        seatData.chis.push(pai2);
        seatData.chis.push(pai3);

        this.dispatchEvent(cc.vv.gameEvent.EVENT_MJ_CHI, { seatIndex: seatIndex, pai1: pai1, pai2: pai2, pai3: pai3 });
    },

    doPENG(seatIndex, pai) {

        var myseatIndex = this.roomData.seatIndex;
        var seatData = this.roomData.seats[seatIndex];
        // 移除手牌
        if (seatIndex == myseatIndex) {
            for (var i = 0; i < 2; i++) {
                var idx = seatData.holds.indexOf(pai);
                if (idx != -1) {
                    seatData.holds.splice(idx, 1);
                }
            }
        }
        else {
            seatData.holds.splice(0, 1);
            seatData.holds.splice(0, 1);
        }

        // 添加碰牌
        seatData.pengs.push(pai);

        this.dispatchEvent(cc.vv.gameEvent.EVENT_MJ_PENG, { seatIndex: seatIndex, pai: pai });
    },

    doGANG(seatIndex, pai, ag) {

        var myseatIndex = this.roomData.seatIndex;
        var seatData = this.roomData.seats[seatIndex];
        // 移除手牌
        if (seatIndex == myseatIndex) {
            for (var i = 0; i < 3; i++) {
                var idx = seatData.holds.indexOf(pai);
                if (idx != -1) {
                    seatData.holds.splice(idx, 1);
                }
            }
        }
        else {
            seatData.holds.splice(0, 1);
            seatData.holds.splice(0, 1);
            seatData.holds.splice(0, 1);
        }

        // 添加杠牌
        seatData.gangs.push(pai);

        this.dispatchEvent(cc.vv.gameEvent.EVENT_MJ_GANG, { seatIndex: seatIndex, pai: pai });
    },

    doANGANG(seatIndex, pai) {

        var myseatIndex = this.roomData.seatIndex;
        var seatData = this.roomData.seats[seatIndex];
        // 移除手牌
        if (seatIndex == myseatIndex) {
            for (var i = 0; i < 4; i++) {
                var idx = seatData.holds.indexOf(pai);
                if (idx != -1) {
                    seatData.holds.splice(idx, 1);
                }
            }
        }
        else {
            for (var i = 0; i < 4; i++) {
                seatData.holds.splice(0, 1);
            }
        }

        // 添加杠牌
        seatData.angangs.push(pai);

        this.dispatchEvent(cc.vv.gameEvent.EVENT_MJ_ANGANG, { seatIndex: seatIndex, pai: pai });
    },

    doJIAGANG(seatIndex, pai) {

        var myseatIndex = this.roomData.seatIndex;
        var seatData = this.roomData.seats[seatIndex];
        // 移除手牌
        if (seatIndex == myseatIndex) {
            for (var i = 0; i < 1; i++) {
                var idx = seatData.holds.indexOf(pai);
                if (idx != -1) {
                    seatData.holds.splice(idx, 1);
                }
            }
        }
        else {
            seatData.holds.splice(0, 1);
        }

        // 移除碰牌
        var pengidx = seatData.pengs.indexOf(pai);
        if (pengidx != -1) {
            seatData.pengs.splice(pengidx, 1);
        }

        // 添加杠牌
        seatData.gangs.push(pai);

        this.dispatchEvent(cc.vv.gameEvent.EVENT_MJ_JIAGANG, { seatIndex: seatIndex, pai: pai });
    },

    doDA(seatIndex, pai) {

        var myseatIndex = this.roomData.seatIndex;
        var seatData = this.roomData.seats[seatIndex];
        // 移除手牌
        if (seatIndex == myseatIndex) {
            var idx = seatData.holds.indexOf(pai);
            if (idx != -1) {
                seatData.holds.splice(idx, 1);
            }
        }
        else {
            seatData.holds.splice(0, 1);
        }
        // 添加出牌
        seatData.folds.push(pai);

        this.dispatchEvent(cc.vv.gameEvent.EVENT_MJ_DA, { seatIndex: seatIndex, pai: pai });
    },

    doTING(seatIndex, pai) {

        console.log('[GameNetMgr.doTING] seatIndex=' + seatIndex + ' pai=' + pai);

        var myseatIndex = this.roomData.seatIndex;
        var seatData = this.roomData.seats[seatIndex];
        // 移除手牌
        if (seatIndex == myseatIndex) {
            var idx = seatData.holds.indexOf(pai);
            if (idx != -1) {
                seatData.holds.splice(idx, 1);
            }
        }
        else {
            seatData.holds.splice(0, 1);
        }
        // 添加出牌
        seatData.folds.push(pai);

        this.dispatchEvent(cc.vv.gameEvent.EVENT_MJ_TING, { seatIndex: seatIndex, pai: pai });
    },

    doMOPAI(seatIndex, pai) {

        var myseatIndex = this.roomData.seatIndex;
        var seatData = this.roomData.seats[seatIndex];

        // console.log("before mopai");
        // console.log(seatData.holds);

        if (seatIndex == myseatIndex) {
            seatData.holds.push(pai);
        }
        else {
            seatData.holds.push(0);
        }

        // console.log("after mopai");
        // console.log(seatData.holds);

        var oldNum = this.roomData.remainCard;

        this.roomData.subRemainCard(1);

        var newNum = this.roomData.remainCard;

        console.log('sub remain card x1' + ' old=' + oldNum + ' new=' + newNum + ' opt=mopai');

        this.dispatchEvent(cc.vv.gameEvent.EVENT_MJ_MOPAI, { seatIndex: seatIndex, pai: pai });
    },

    // 玩家执行命令
    sendPlayerCmdExcute(seatIndex, cmdcode, mjid1, mjid2, chiIndex, choice) {

        var pt1 = 255;
        var pv1 = 255;
        var pt2 = 255;
        var pv2 = 255;

        if (mjid1) {
            pt1 = Math.floor(mjid1 / cc.vv.const.MJTYPE_MULTI);
            pv1 = mjid1 % cc.vv.const.MJTYPE_MULTI;
        }
        if (mjid2) {
            pt2 = Math.floor(mjid1 / cc.vv.const.MJTYPE_MULTI);
            pv2 = mjid1 % cc.vv.const.MJTYPE_MULTI;
        }

        if (chiIndex == null) {
            chiIndex = 0;
        }
        if (choice == null || choice == false) {
            choice = 0;
        }
        else {
            choice = 1;
        }

        var pw = new PacketWriter();
        pw.writeid(cc.vv.packid.PACKETID_403);
        pw.writeu1(seatIndex);
        pw.writeu1(cmdcode);
        pw.writeu1(pt1);
        pw.writeu1(pv1);
        pw.writeu1(pt2);
        pw.writeu1(pv2);
        pw.writeu1(chiIndex);
        pw.writeu1(choice);

        // console.log(pw);

        cc.vv.socketMgr.bufferPack(pw.getdata());
    },

    connectGameServer: function (data) {
        this.dissoveData = null;
        cc.vv.net.ip = data.ip + ":" + data.port;
        console.log(cc.vv.net.ip);
        var self = this;

        var onConnectOK = function () {
            console.log("onConnectOK");
            var sd = {
                token: data.token,
                roomid: data.roomid,
                time: data.time,
                sign: data.sign,
            };
            cc.vv.net.send("login", sd);
        };

        var onConnectFailed = function () {
            console.log("failed.");
            cc.vv.wc.hide();
        };
        cc.vv.wc.show("正在进入房间");
        cc.vv.net.connect(onConnectOK, onConnectFailed);
    },

    // 响应解散房间操作
    sendVoteDisband: function (isAgree) {
        var pw = new PacketWriter();
        pw.writeid(cc.vv.packid.PACKETID_305);
        pw.writeu1(isAgree);

        cc.vv.socketMgr.bufferPack(pw.getdata());
    },

    // 解散房间
    sendDisband: function () {
        var pw = new PacketWriter();
        pw.writeid(cc.vv.packid.PACKETID_304);
        pw.writeu1(1);

        cc.vv.socketMgr.bufferPack(pw.getdata());
    },

    // 后台切回前台，尝试重连逻辑服务器
    tryReconnectLogicServer: function () {

        if (cc.vv.myself.playerId > 0) {

            /** Reconnect Protocol
             *  C->S
                {
                    Uint64	玩家ID
                    Uint32	小版本号
                    Uint8	是否插件模式外框
                    Uint8	是否插件模式
                }
                S->C
                {
                    Uint8  结果0成功其他 errorcode
                    Uint8  当前状态 1大厅 2房间等待 3房间战斗 4下一回合等待开始
                }
             */

            cc.vv.gameNetMgr.roomData.bNeedLoad = true;

            var pw = new PacketWriter();
            pw.writeid(cc.vv.packid.PACKETID_104);
            pw.writeu8(cc.vv.myself.playerId);
            pw.writeu4(0);
            cc.vv.socketMgr.bufferPack(pw.getdata());
            console.log('send 104 reconnect logic server');
        }

    },

    onRequestPlayerInfoEvent(playerId) {
        console.log("ask" + "_" + playerId + "_" + "playerInfo");
        var pw = new PacketWriter();
        pw.writeid(cc.vv.packid.PACKETID_208);
        pw.writeu8(playerId);
        cc.vv.socketMgr.bufferPack(pw.getdata());
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
