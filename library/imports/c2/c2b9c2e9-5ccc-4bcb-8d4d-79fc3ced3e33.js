"use strict";
cc._RF.push(module, 'c2b9cLpXMxLy41Nefw87T4z', 'Utils');
// scripts/components/Utils.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

String.prototype.format = function (args) {
    //字符串传参接口
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && (typeof args === "undefined" ? "undefined" : _typeof(args)) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};
var Utils = {
    addClickEvent: function addClickEvent(node, target, component, handler) {
        console.log(component + ":" + handler);
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },

    addSlideEvent: function addSlideEvent(node, target, component, handler) {
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var slideEvents = node.getComponent(cc.Slider).slideEvents;
        slideEvents.push(eventHandler);
    },

    addEscEvent: function addEscEvent(node) {
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function onKeyPressed(keyCode, event) {},
            onKeyReleased: function onKeyReleased(keyCode, event) {
                if (keyCode == cc.KEY.back) {
                    cc.vv.alert.show('提示', '确定要退出游戏吗？', function () {
                        cc.game.end();
                    }, true);
                }
            }
        }, node);
    },

    setHeadAvatar: function setHeadAvatar(sprite, avatarUrl, isBigImg) {

        // TODO: 测试用图
        //avatarUrl = 'http://wx.qlogo.cn/mmopen/vi_32/OVbiaUWeLtZYOXibxl9yk8Ezvvz7iaAnsUghN2SlaevzhaItJh3x9Ih963UDfb5Tr4XXl3hFCtqeqj7EPPKjANyZQ/0';
        if (avatarUrl.length > 0) {

            //有0、46、64、96、132数值可选，0代表640*640正方形头像

            if (isBigImg == true) {

                // 使用大图 将/xxx结尾替换成/0结尾

                var idx = avatarUrl.lastIndexOf('/');
                if (idx != -1) {
                    avatarUrl = avatarUrl.substring(0, idx);
                    avatarUrl = avatarUrl + '/0';
                }
            } else {

                // 不要大图 如果是/0结尾则替换成/96

                var idx = avatarUrl.lastIndexOf('/0');
                if (idx != -1) {
                    avatarUrl = avatarUrl.substring(0, idx);
                    avatarUrl = avatarUrl + '/96';
                }
            }

            // if (!isBigImg || isBigImg == null){
            //     var idx = avatarUrl.lastIndexOf('/0');
            //     if (idx !=-1){
            //         avatarUrl = avatarUrl.substring(0, idx);
            //         avatarUrl = avatarUrl + '/96';
            //     }
            // }


            // 防止重复刷新头像
            if (typeof sprite.avatarUrl !== 'undefined' && sprite.avatarUrl === avatarUrl) {
                return;
            }

            var avatarSprite = sprite;
            var iconUrl = avatarUrl;
            cc.loader.load({ url: avatarUrl, type: 'png' }, function (err, texture) {
                if (!cc.isValid(avatarSprite.node)) {
                    return;
                }
                if (!err && avatarSprite) {
                    avatarSprite.spriteFrame = new cc.SpriteFrame();
                    avatarSprite.spriteFrame.setTexture(texture);
                    avatarSprite.avatarUrl = iconUrl;
                } else {
                    avatarSprite.spriteFrame = cc.vv.atlas.main.getSpriteFrame(cc.vv.const.DEFAULT_HEAD_AVATAR_FRAME_NAME);
                }
            });
        } else {

            // 设置为默认头像

            // 防止重复刷新头像
            if (typeof sprite.avatarUrl !== 'undefined' && sprite.avatarUrl === cc.vv.const.DEFAULT_HEAD_AVATAR_FRAME_NAME) {
                return;
            }

            sprite.spriteFrame = cc.vv.atlas.main.getSpriteFrame(cc.vv.const.DEFAULT_HEAD_AVATAR_FRAME_NAME);
        }
    },


    // createImage(sprite, avatarUrl) {
    //     if (cc.vv.wxHelper.iswxPlatform()) {

    //     } else {

    //     }

    // },

    createPrefabByUrl: function createPrefabByUrl(url, parent, cb) {
        cc.loader.loadRes(url, function (completedCount, totalCount, item) {
            if (cc.vv.loading) {
                cc.vv.loading.updateView(completedCount, totalCount);
            }
        }, function (err, prefab) {
            var node = cc.instantiate(prefab);
            if (parent == null) {
                cc.find("Canvas").addChild(node);
            } else {
                parent.addChild(node);
            }
            if (typeof cb == "function") {
                cb(node);
            }
        });
    },


    // createLoadResProgress () {
    //     cc.loader.loadRes("prefabs/load_progress",function (err, prefab) {
    //         let node = cc.instantiate(prefab);
    //         cc.director.getScene().getChildByName("Canvas").addChild(node, 1);
    //         node.active = false;
    //     });
    // },
    //releaseResource (url, type) {
    // var res = cc.loader.getRes(url, type);
    // var all = cc.loader.getDependsRecursively(res);
    // cc.loader.release(all);

    // cc.loader.release(cc.loader.getDependsRecursively(this.messageBox));
    // cc.loader.release(cc.loader.getDependsRecursively(this.reconnectionAnims));
    // cc.loader.release(cc.loader.getDependsRecursively(this.settingUI));
    // cc.loader.release(cc.loader.getDependsRecursively(this.createRoomUI));
    //}
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    // 显示确认对话框
    showDialogOK: function showDialogOK(message, okCallback, bUseRichText, alignH, okBtnTextSpr) {

        console.log('[Utils.showDialogOK] message = ' + message);

        cc.loader.loadRes("prefabs/dialog", function (err, prefab) {

            if (err) {
                console.log('[Utils.showDialogOK] load callback');
                console.log(err);
            } else {
                var bRichText = "undefind" === bUseRichText ? false : bUseRichText;
                alignH = null == alignH ? cc.vv.enum.EnumLabelHorizontalAlign.CENTER : alignH;
                var curscene = cc.director.getScene();
                var dialog = cc.instantiate(prefab);
                dialog.getComponent('Dialog').init(message, bRichText, true, false, true, okCallback, null, alignH, null, okBtnTextSpr);
                dialog.parent = curscene.children[0];
            }
        });
    },


    // 显示取消对话框
    showDialogCancel: function showDialogCancel(message, cancelCallback, bUseRichText, cancelBtnTextSpr) {

        console.log('[Utils.showDialogCancel] message = ' + message);

        cc.loader.loadRes("prefabs/dialog", function (err, prefab) {

            if (err) {
                console.log('[Utils.showDialogCancel] load callback');
                console.log(err);
            } else {
                var bRichText = 'undefined' === bUseRichText ? false : bUseRichText;
                var curscene = cc.director.getScene();
                var dialog = cc.instantiate(prefab);
                dialog.getComponent('Dialog').init(message, bRichText, false, true, true, null, cancelCallback, null, null, null, cancelBtnTextSpr);
                dialog.parent = curscene.children[0];
            }
        });
    },


    // 显示确定与取消对话框
    showDialogOKCancel: function showDialogOKCancel(message, okCallback, cancelCallback, bUseRichText, alignH, callback) {

        console.log('[Utils.showDialogOKCancel] message = ' + message);

        cc.loader.loadRes("prefabs/dialog", function (err, prefab) {

            if (err) {
                console.log('[Utils.showDialogOKCancel] load callback');
                console.log(err);
            } else {
                var bRichText = 'undefined' === bUseRichText ? false : bUseRichText;
                alignH = "undefind" === alignH ? cc.vv.enum.EnumLabelHorizontalAlign.CENTER : alignH;
                var curscene = cc.director.getScene();
                var dialog = cc.instantiate(prefab);
                dialog.getComponent('Dialog').init(message, bRichText, true, true, true, okCallback, cancelCallback, alignH, callback);
                dialog.parent = curscene.children[0];
            }
        });
    },


    // 显示确定对话框（有关闭按钮事件）
    showDialogOKOnly: function showDialogOKOnly(message, okCallback, bUseRichText, zIndex) {

        console.log('[Utils.showDialogOKCancel] message = ' + message);

        cc.loader.loadRes("prefabs/dialog", function (err, prefab) {

            if (err) {
                console.log('[Utils.showDialogOKCancel] load callback');
                console.log(err);
            } else {
                var bRichText = 'undefined' === bUseRichText ? false : bUseRichText;
                var curscene = cc.director.getScene();
                var dialog = cc.instantiate(prefab);
                dialog.getComponent('Dialog').init(message, bRichText, true, false, false, okCallback, null);
                dialog.parent = curscene.children[0];
                if (zIndex != null) {
                    dialog.zIndex = zIndex;
                }
            }
        });
    },


    // 显示飘窗
    showFlyTip: function showFlyTip(str, cb) {
        console.log('[Utils.showFlyTip] str = ' + str);

        cc.loader.loadRes("prefabs/fly_tip_node", function (err, prefab) {
            if (err) {
                console.log('[Utils.showFlyTip] load callback');
                console.log(err);
            } else {
                var scene = cc.director.getScene();
                var flyTipNode = cc.instantiate(prefab);
                flyTipNode.parent = scene;
                flyTipNode.getComponent('FlyTip').updateTip(str);
                if (typeof cb == "function") {
                    cb();
                }
            }
        });
    },

    //时间戳转换
    getTimeStampToNow: function getTimeStampToNow(date, symbol, dateType) {
        var date = new Date(date * 1000); //如果date为10位不需要乘1000
        var Y = date.getFullYear() + symbol[0];
        var M = (date.getMonth() + 1 < 10 ? +(date.getMonth() + 1) : date.getMonth() + 1) + symbol[1];
        var D = (date.getDate() < 10 ? +date.getDate() : date.getDate()) + symbol[2];
        var h = " " + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        if (dateType === "ALL") {
            return Y + M + D + h + m + s;
        }
        if (dateType === "YMD") {
            return Y + M + D;
        }
        if (dateType === "MD") {
            return M + D;
        }
        if (dateType === "HMS") {
            return h + m + s;
        }
    },


    // 时间戳转换
    // @param stamp: 时间戳
    // @param needDateStr: 需要的数据数组：'yMdHms'
    // @param symbolType: 间隔符，不传值默认显示“年月日时分秒”
    getStrByTimeStamp: function getStrByTimeStamp(stamp, needDateStr, symbolType) {
        var bUseDefault = true;
        var symbolArr = [cc.vv.lan.MATCH_LAN[22], cc.vv.lan.MATCH_LAN[23], cc.vv.lan.MATCH_LAN[24], cc.vv.lan.MATCH_LAN[25], cc.vv.lan.MATCH_LAN[2], cc.vv.lan.MATCH_LAN[3]];
        if ('undefined' !== typeof symbolType && null != symbolType) {
            symbolArr = [symbolType, symbolType, '', ':', ':', ''];
            bUseDefault = false;
        }

        var time = new Date(stamp * 1000);
        var timeObj = {};
        timeObj.y = time.getFullYear();
        timeObj.M = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
        timeObj.d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
        timeObj.H = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
        timeObj.m = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
        timeObj.s = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();

        var dateStr = '';
        var allStr = 'yMdHms';
        for (var i = 0; i < needDateStr.length; i++) {
            if ('H' == needDateStr[i] && i > 0) {
                dateStr += ' ';
            }

            dateStr += timeObj[needDateStr[i]];

            if (i + 1 < needDateStr.length || bUseDefault) {
                var index = allStr.indexOf(needDateStr[i]);
                dateStr += symbolArr[index];
            }
        }

        return dateStr;
    },


    // 普通邀请分享，带邀请链接
    shareGame: function shareGame(title, imgUrl, witchShareTicket, matchId, sceneID) {
        if (cc.vv.wxHelper.iswxPlatform()) {
            if (matchId != null) {
                var query = 'inviterId=' + cc.vv.myself.playerId + '&inviterName=' + cc.vv.myself.playerName + '&inviterMatchId=' + cc.vv.matchData.matchId + '&inviterSceneID=' + sceneID;
            } else {
                var query = 'inviterId=' + cc.vv.myself.playerId + '&inviterName=' + cc.vv.myself.playerName + '&inviterSceneID=' + sceneID;
            }
            var title = title;
            var imgUrl = imgUrl;
            if (title == null && imgUrl == null) {
                title = cc.vv.lan.SHARE_TITLE_GAME;
                imgUrl = cc.vv.const.WX_SHARE_GAME_URL;
            }
            if (witchShareTicket != null) {
                cc.vv.wxHelper.updateShareMenu(witchShareTicket, function () {
                    cc.vv.wxHelper.shareAppMessageQuery(title, imgUrl, query, null, null, sceneID);
                });
            } else {
                cc.vv.wxHelper.updateShareMenu(false, function () {
                    cc.vv.wxHelper.shareAppMessageQuery(title, imgUrl, query, null, null, sceneID);
                });
            }
        } else {
            console.log('not wx platform.');
        }
    },


    // 比赛奖励分享，带邀请链接
    shareAward: function shareAward(witchShareTicket, sceneID) {
        if (cc.vv.wxHelper.iswxPlatform()) {
            var query = 'inviterId=' + cc.vv.myself.playerId + '&inviterName=' + cc.vv.myself.playerName + '&inviterSceneID=' + sceneID;
            if (witchShareTicket != null) {
                cc.vv.wxHelper.updateShareMenu(witchShareTicket, function () {
                    cc.vv.wxHelper.shareAppMessageQuery(cc.vv.lan.SHARE_TITLE_AWARD, cc.vv.const.WX_SHARE_AWARD_URL, query, null, null, sceneID);
                });
            } else {
                cc.vv.wxHelper.updateShareMenu(false, function () {
                    cc.vv.wxHelper.shareAppMessageQuery(cc.vv.lan.SHARE_TITLE_AWARD, cc.vv.const.WX_SHARE_AWARD_URL, query, null, null, sceneID);
                });
            }
        } else {
            console.log('not wx platform.');
        }
    },


    //带回调的分享
    shareGameWithCallBackEvent: function shareGameWithCallBackEvent(title, imgUrl, witchShareTicket, successback, failback, sceneID) {
        if (cc.vv.wxHelper.iswxPlatform()) {
            var query = 'inviterId=' + cc.vv.myself.playerId + '&inviterName=' + cc.vv.myself.playerName + '&inviterSceneID=' + sceneID;
            var _shareTicket = false;
            if (witchShareTicket != null) {
                _shareTicket = witchShareTicket;
            }
            cc.vv.wxHelper.updateShareMenu(_shareTicket, function () {
                cc.vv.wxHelper.shareAppMessageQuery(title, imgUrl, query, successback, failback, sceneID);
            });
        } else {
            console.log('not wx platform.');
        }
    },


    //分享到群查看群排行
    shareGroupRankEvent: function shareGroupRankEvent(title, imgUrl, sceneID) {
        if (cc.vv.wxHelper.iswxPlatform()) {
            console.log("shareGroupRankEvent");
            //这里加上分享类型 inviterInitType属性表示是否主动拉起界面 inviterInitModule属性表示主动拉起的界面的枚举
            var query = 'inviterId=' + cc.vv.myself.playerId + '&inviterName=' + cc.vv.myself.playerName + '&inviterInitType=' + 1 + '&inviterInitModule=' + cc.vv.enum.EnumInitView.EIV_GROUP + '&inviterSceneID=' + sceneID;
            var title = title;
            var imgUrl = imgUrl;
            if (title == null && imgUrl == null) {
                title = cc.vv.lan.SHARE_TITLE_GAME;
                imgUrl = cc.vv.const.WX_SHARE_GAME_URL;
            }
            cc.vv.wxHelper.updateShareMenu(true, function () {
                cc.vv.wxHelper.shareAppMessageQuery(title, imgUrl, query, null, null, sceneID);
            });
        } else {
            console.log('not wx platform.');
        }
    },
    getSubstringDataByLength: function getSubstringDataByLength(str, maxLen, subLen) {
        if (maxLen == null) {
            maxLen = cc.vv.const.SUBSTRING_MAXLENGTH;
        }
        if (subLen == null) {
            subLen = cc.vv.const.SUBSTRING_LENGTH;
        }
        var newArr = [];
        var totalLength = 0;
        var list = str.split("");
        if (this.getStringDataLength(str) <= maxLen) {
            return str;
        } else {
            for (var i = 0; i < str.length; i++) {
                var strI = list[i];
                if (totalLength < subLen) {
                    if (strI.match(/[\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]/g)) {
                        //console.log("半角符号");
                        totalLength += 0.5;
                    } else if (strI.match(/[^\x00-\xff]/g)) {
                        //console.log("双字节符号");
                        totalLength += 2;
                    } else if (strI.match(/^[a-zA-Z\d]+$/g)) {
                        //console.log("字母数字");
                        totalLength += 1;
                    }
                    newArr.push(strI);
                }
            }
            return newArr.join("") + "...";
        }
    },
    getStringDataLength: function getStringDataLength(str) {
        var totalLength = 0;
        var list = str.split("");
        for (var i = 0; i < str.length; i++) {
            var strI = list[i];
            if (strI.match(/[\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]/g)) {
                totalLength += 0.5;
            } else if (strI.match(/[^\x00-\xff]/g)) {
                totalLength += 2;
            } else if (strI.match(/^[a-zA-Z\d]+$/g)) {
                totalLength += 1;
            }
        }
        return totalLength;
    },
    getWeightArr: function getWeightArr(arr) {
        //数组去重
        var newArr = [];
        for (var i = 0; i < arr.length; i++) {
            if (newArr.indexOf(arr[i]) == -1) newArr.push(arr[i]);
        }
        return newArr;
    },
    getTimeStampByString: function getTimeStampByString(date) {
        // 字符串类型时间 转换成时间戳
        var newDate = date.replace(/-/g, '/'); //兼容ios不能转换  2018-12-12  等格式日期
        return Date.parse(newDate) / 1000;
    },


    // 显示引导遮罩
    showGuideNode: function showGuideNode(dataObj) {
        cc.loader.loadRes("prefabs/guide_node", function (err, prefab) {
            var guideNode = cc.instantiate(prefab);
            guideNode.zIndex = 1000;
            guideNode.parent = cc.find("Canvas");
            guideNode.active = true;
            guideNode.getComponent('GuideNode').init(dataObj);
        });
    },

    //强制保留位数
    toDecimalByLen: function toDecimalByLen(x, len) {
        if (len == null) {
            len = cc.vv.const.HOLDNUM_LEN;
        }
        var f = parseFloat(x);
        if (isNaN(f)) {
            return false;
        }
        var roundNum = Math.pow(10, len);
        var f = Math.floor(x * roundNum) / roundNum;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + len) {
            s += '0';
        }
        return s;
    },


    // 获取金币场金币显示
    getGoldShow: function getGoldShow(num) {
        if (num > 99999 && num < 100000000) {
            var tmpNum = num / 10000;
            var fewNum = cc.vv.utils.getDigit(tmpNum);
            if (0 != fewNum) {
                if (num < 100000) {
                    num = this.toDecimalByLen(tmpNum, 3) + cc.vv.lan.MATCH_LAN[109];
                } else if (num >= 100000 && num < 1000000) {
                    num = this.toDecimalByLen(tmpNum, 2) + cc.vv.lan.MATCH_LAN[109];
                } else if (num >= 1000000 && num < 10000000) {
                    num = this.toDecimalByLen(tmpNum, 1) + cc.vv.lan.MATCH_LAN[109];
                } else if (num >= 10000000) {
                    num = Math.floor(tmpNum) + cc.vv.lan.MATCH_LAN[109];
                }
            } else {
                num = tmpNum + cc.vv.lan.MATCH_LAN[109];
            }
        } else if (num >= 100000000) {
            var tmpNum = num / 100000000;
            var fewNum = cc.vv.utils.getDigit(tmpNum);
            if (0 != fewNum) {
                if (num < 1000000000) {
                    num = this.toDecimalByLen(tmpNum, 3) + cc.vv.lan.MATCH_LAN[129];
                } else if (num >= 1000000000 && num < 10000000000) {
                    num = this.toDecimalByLen(tmpNum, 2) + cc.vv.lan.MATCH_LAN[129];
                } else if (num >= 10000000000 && num < 100000000000) {
                    num = this.toDecimalByLen(tmpNum, 1) + cc.vv.lan.MATCH_LAN[129];
                } else if (num >= 100000000000) {
                    num = Math.floor(tmpNum) + cc.vv.lan.MATCH_LAN[129];
                }
            } else {
                num = tmpNum + cc.vv.lan.MATCH_LAN[129];
            }
        }
        return num;
    },

    // 判断几位小数
    getDigit: function getDigit(num) {
        var floorNum = Math.floor(num);
        var fewNum = 0;
        var integerNum = 0; // 整数
        var decimalNum = num - floorNum; // 小数
        if (0 != decimalNum) {
            for (var i = 0; i < 3; i++) {
                decimalNum = decimalNum * 10;
                var tmp = decimalNum.toString().split('.');
                integerNum = tmp[0];
                decimalNum = tmp[1];
                if (0 != decimalNum) {
                    fewNum += 1;
                } else {
                    if (0 != integerNum) {
                        fewNum += 1;
                    }
                    return fewNum;
                }
            }
        }

        return fewNum;
    },

    // 关闭其他界面回到大厅
    returnToHall: function returnToHall() {
        var initArr = cc.find('Canvas').getComponent('Match')._initChildNameArr;
        var childArr = cc.find('Canvas').children;
        for (var i = childArr.length - 1; i >= 0; i--) {
            var bFind = false;
            for (var j = 0; j < initArr.length; j++) {
                if (childArr[i].name == initArr[j] || 'mj_battle_node' == childArr[i].name) {
                    bFind = true;
                    break;
                }
            }

            if (!bFind) {
                childArr[i].destroy();
            }
        }
    },

    // 秒数转换为倒计时 00:00:00
    secondToCountDown: function secondToCountDown(totalSecond) {

        var h = Math.floor(totalSecond / 3600);
        var m = Math.floor(totalSecond % 3600 / 60);
        var s = totalSecond % 3600 % 60;

        var str = '';
        str += h < 10 ? '0' + h : h;
        str += ':';
        str += m < 10 ? '0' + m : m;
        str += ':';
        str += s < 10 ? '0' + s : s;

        return str;
    },


    // 获取任意范围的随机整数[min, max]
    getRandomInt: function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // 判断如果上万则取万位以上的值
    getTenThousandBesidesValue: function getTenThousandBesidesValue(num) {
        if (num > 10000) {
            return num / 10000;
        } else {
            return num;
        }
    },

    // 判断当前画布是否有当前节点
    getNodeByName: function getNodeByName(node) {
        var nodeTab = [];
        if (cc.find("Canvas").getChildByName(node)) {
            nodeTab.bool = true;
            nodeTab.view = cc.find("Canvas").getChildByName(node);
            return nodeTab;
        } else {
            nodeTab.bool = false;
            return nodeTab;
        }
    },


    //播放窗体关闭动画  并销毁节点
    closeViewFunction: function closeViewFunction(target) {
        target.getComponent(cc.Animation).on('finished', function () {
            target.destroy();
        });
        target.getComponent(cc.Animation).play("close_view");
    },


    //当前时间戳
    getNowTimeStamp: function getNowTimeStamp() {
        return Date.parse(new Date()) / 1000;
    },

    //通过位数加点（默认按三位为一个单位）
    //nDigit 位数
    getPointNum: function getPointNum(nNum, nDigit) {
        nDigit = nDigit || 3;

        var nUnit = 1;
        var sSplicing = "";
        for (var index = 0; index < nDigit; index++) {
            nUnit = nUnit * 10;
        }
        var nTempNum = 0;
        for (var idx = 1; idx > 0; idx++) {
            if (nNum / nUnit >= 1) {
                nTempNum = (Array(3).join(0) + nNum % nUnit).slice(-3);
                if (sSplicing != "") {
                    sSplicing = nTempNum + ',' + sSplicing;
                } else {
                    sSplicing = nTempNum;
                }

                nNum = Math.floor(nNum / nUnit);
            } else {
                if (nNum != 0) {
                    if (sSplicing != "") {
                        sSplicing = nNum + ',' + sSplicing;
                    } else {
                        sSplicing = nNum;
                    }
                }
                break;
            }
        }
        if (sSplicing == "") {
            sSplicing = '0';
        }
        return sSplicing;
    },

    getBestRecord: function getBestRecord() {
        if (cc.DataUser.gameStatus === cc.GameStatus.Win) {
            if (!cc.DataUser.bestRecord) {
                cc.DataUser.bestRecord = cc.DataUser.currentRecord;
            } else {
                cc.DataUser.bestRecord = cc.DataUser.bestRecord > cc.DataUser.currentRecord ? cc.DataUser.currentRecord : cc.DataUser.bestRecord;
            }
        }
        return cc.DataUser.bestRecord;
    },
    getTimeString: function getTimeString(date) {
        var dateString = null;
        var second = 0,
            minute = 0,
            hour = 0;
        var secondStr = null,
            minuteStr = null,
            hourStr = null;
        if (0 <= date && date < 60) {
            secondStr = second = date;
        } else if (60 <= date && date < 3600) {
            secondStr = second = date % 60;
            minuteStr = minute = Math.floor(date / 60);
        } else if (3600 <= date && date < 360000) {
            secondStr = second = date % 60;
            minuteStr = minute = Math.floor(date / 60) % 60;
            hourStr = hour = Math.floor(date / 3600);
        } else {
            return cc.GameLanguage.zhLanguage[8];
        }
        if (second < 10) {
            secondStr = "0" + second;
        }
        if (minute < 10) {
            minuteStr = "0" + minute;
        }
        if (hour < 10) {
            hourStr = "0" + hour;
        }
        return cc.GameLanguage.zhLanguage[5].format(hourStr, minuteStr, secondStr);
    },


    //生成从minNum到maxNum的随机数
    randomNum: function randomNum(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
                break;
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                break;
            default:
                return 0;
                break;
        }
    }
};
module.exports = Utils;
cc.Utils = Utils;

cc._RF.pop();