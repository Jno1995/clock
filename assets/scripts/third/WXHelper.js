const WXHelper = {
    authScopeUserInfo: false, // 是否已授权获取用户信息
    sessionID: null,
    isLoadingShow: false,
    requestURL: null,
    inited: false,
    userInfoBtn: null,
    downloadTotalCountArr: [], // 开始加载的文件的总进度信息
    downloadCompleteCountArr: [], // 开始加载的文件的完成进度信息
    downloadProgress: 0, // 加载进度
    openId: null,  //用户openId
    weChatKey: [  // 用于查询开放域排行榜数据的Key值
        "bonusPoint",
        "masterPoint",
        "answerTime",
    ],
    RankHeight: [  // 设置子域可视高度
        320,
    ],
    shareTicket: null,
    scene: null, //场景值
    _initGroupRankIndex: 0, //群排行界面初始序列
    _isReadyGroupRank: true,
    _isShowGroupRank: false,
    _groupRankNode: null,
    _groupRankCanvasWidth: 801,
    _groupRankCanvasHeight: 401.951,
    _isCollect: false,  //用户是否已经收藏小游戏
    _queryData: null,  //卡片分享中的数据
    init() {
        var self = this;
        if (this.inited) {
            return;
        }
        this.requestURL = cc.vv.const.WX_REQUEST_URL;

        this.keepScreenOn();

        wx.onHide(function () {
            console.log('[wx.onHide] callback');
            var groupRankNode = cc.find("Canvas/group_rank");
            self._groupRankNode = groupRankNode;
            if (groupRankNode) {
                self._isShowGroupRank = true;
                self._isReadyGroupRank = true;
            } else {
                self._isShowGroupRank = false;
            }
            // 通知切后台
            cc.vv.gameEvent.dispatchEvent(cc.vv.gameEvent.EVENT_ENTER_BACKGROUND);
        });

        wx.onShow(function (res) {

            console.log('[wx.onShow] callback');
            console.log(res);

            // 关掉再回来需要重新设置常亮
            self.keepScreenOn();

            if (res.scene == cc.vv.const.WX_SCENE_VALUE_1044) {
                if (!cc.vv.matchData.isMatch() && cc.vv.myself.guideStep == 2) {
                    if (typeof res.query.inviterId != "undefined") {
                        if (self._isReadyGroupRank) {
                            wx.postMessage({
                                command: "groupRank",
                                shareTicket: res.shareTicket,
                                keyData: self.weChatKey,
                                myOpenId: self.openId,
                                initGroupIndex: self._initGroupRankIndex,
                            });
                            if (self._isShowGroupRank) {
                                self._groupRankNode.getComponent("GroupRank").initView(self._initGroupRankIndex, true);
                            }
                            if (!self._isShowGroupRank) {
                                if (res.query.inviterInitType == '1' && res.query.inviterInitModule == cc.vv.enum.EnumInitView.EIV_GROUP
                                    && res.query.inviterInitType && res.query.inviterInitModule) {
                                    cc.vv.utils.createPrefabByUrl(cc.vv.const.URL_GROUP_RANK, null, function (node) {
                                        node.getComponent("GroupRank").initView(self._initGroupRankIndex, true);
                                    });
                                }
                            }
                        }
                    }
                }
            }
            // 通过查询字符串链接进入
            if (res.query) {
                self._queryData = res.query;
                cc.vv.gameEvent.dispatchEvent(cc.vv.gameEvent.EVENT_WX_QUERY, res.query);
            }
            if (res.scene == cc.vv.const.WX_SCENE_VALUE_1104) {
                self._isCollect = true;
            }

            // 发起重连
            cc.vv.gameNetMgr.tryReconnectLogicServer();

            // 通知切前台
            cc.vv.gameEvent.dispatchEvent(cc.vv.gameEvent.EVENT_ENTER_FOREGROUND);
        });

        wx.onAudioInterruptionBegin(function () {
            console.log('[wx.onAudioInterruptionBegin] callback');

            cc.vv.gameEvent.dispatchEvent(cc.vv.gameEvent.EVENT_AUDIO_INTERRUPTION_BEGIN);
        });

        wx.onAudioInterruptionEnd(function () {
            console.log('[wx.onAudioInterruptionEnd] callback');

            cc.vv.gameEvent.dispatchEvent(cc.vv.gameEvent.EVENT_AUDIO_INTERRUPTION_END);
        });

        // 右上角转发
        wx.onShareAppMessage(function () {
            var query = '';
            if (typeof cc.vv != 'undefined'
                && typeof cc.vv.myself != 'undefined'
                && typeof cc.vv.myself.playerId != 'undefined'
                && typeof cc.vv.myself.playerName != 'undefined') {
                query = 'inviterId=' + cc.vv.myself.playerId + '&inviterName=' + cc.vv.myself.playerName;
            }

            return {
                title: cc.vv.lan.SHARE_TITLE_GAME,
                query: query,
                imageUrl: cc.vv.const.WX_SHARE_GAME_URL,
            }
        });

        if (typeof wx.getUpdateManager === 'function') {
            const updateManager = wx.getUpdateManager();
            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
                console.log('[wx.onCheckForUpdate]');
                console.log(res.hasUpdate);
            });

            updateManager.onUpdateReady(function () {
                console.log('[wx.onUpdateReady]');
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate();
            });

            updateManager.onUpdateFailed(function () {
                // 新的版本下载失败
                console.log('[wx.onUpdateFailed]');
            });
        }

        this.inited = true;
    },

    iswxPlatform() {
        return cc.sys.platform === cc.sys.WECHAT_GAME;
    },

    setClipboardData(data, _callback) {
        if (this.iswxPlatform()) {
            wx.setClipboardData({
                data: data,
                success: function (res) {
                    if (typeof _callback == "function") {
                        _callback();
                    }
                },
            });
        } else {
            var save = function (e) {
                e.clipboardData.setData('text/plain', data);
                e.preventDefault();
            }.bind(this);
            document.addEventListener('copy', save);
            document.execCommand('copy');
            document.removeEventListener('copy', save);
        }
    },

    showLoading(title, mask) {

        console.log('[WXHelper.showLoading]');

        // if (this.isLoadingShow){
        //     return;
        // }

        // console.log('[wx.showLoading]');

        // wx.showLoading({
        //     title: title,
        //     mask: mask,
        //     // success:function(res){

        //     // },
        //     // fail:function(){

        //     // },
        //     // complete:function(){

        //     // },
        // });

        // this.isLoadingShow = true;
    },

    hideLoading() {
        console.log('[WXHelper.hideLoading]');
        if (this.isLoadingShow) {
            console.log('[wx.hideLoading]');
            wx.hideLoading();
            this.isLoadingShow = false;
        }
    },

    // 显示转发
    showShareMenu() {
        console.log('[WXHelper.showShareMenu]');
        wx.showShareMenu();
    },

    updateShareMenu(type, _callback) {
        wx.updateShareMenu({
            withShareTicket: type,
            success: function (res) {
                console.log("updateShareMenu success");
                if (typeof _callback == "function") {
                    _callback();
                }
            },
            fail: function (res) {
                console.log("updateShareMenu fail");
            },
        });
    },

    getShareInfo(type, _callback) {
        var self = this;
        wx.getShareInfo({
            shareTicket: type,
            success: function (res) {
                console.log("getShareInfo success");
                console.log(res)
                var errMsg = res.errMsg;
                var encryptedData = res.encryptedData;
                var iv = res.iv;

                wx.request({
                    url: self.requestURL + 'decrypt',
                    data: {
                        sessionID: self.sessionID,
                        encryptedData: encryptedData,
                        iv: iv,
                    },
                    // header:{},
                    method: 'POST',
                    // dataType:'json',
                    // responseType:'text',
                    success: function (res) {
                        console.log('[wx.getUserInfo.request] success.');
                        console.log(res);
                        console.log(res.data);
                        if (res.statusCode === 200) {
                            if (typeof _callback == "function") {
                                _callback(res.data.Data.openGId);
                            }
                        }
                    },
                    fail: function () {
                        console.log('[wx.getShareInfo.request] fail.');
                    },
                    complete: function () {
                        console.log('[wx.getShareInfo.request] complete.');
                    },
                })


            },
            fail: function (res) {
                console.log("getShareInfo fail");
            },
            complete: function (res) {
                console.log("getShareInfo complete");

            },
        });
    },

    // 隐藏转发
    hideShareMenu() {
        console.log('[WXHelper.hideShareMenu]');
        wx.hideShareMenu();
    },

    // 主动转发，截屏
    shareAppMessageScn(title, shareTicket) {
        console.log('[WXHelper.shareAppMessageScn]');

        wx.updateShareMenu({
            withShareTicket: shareTicket,
            success: function (res) {
                wx.shareAppMessage({
                    // title:'这是一个测试分享标题！如果这个标题很长很长很长很长很长很长很长很长很长很长很长很长很长很长\n很长很长很长很长很长很长很长很长很长很长会怎么显示？',
                    title: title,
                    imageUrl: canvas.toTempFilePathSync({
                        // destWidth:500,
                        // destHeight:400,
                        destWidth: 1280,
                        destHeight: 720,
                    }),
                    success: function (res) {
                        console.log('[wx.shareAppMessage] success.');
                        console.log(res);
                    },
                    fail: function (res) {
                        console.log('[wx.shareAppMessage] fail.');
                        console.log(res);
                    },
                    complete: function (res) {
                        console.log('[wx.shareAppMessage] complete.');
                        console.log(res);
                    },
                });
            },
        });

    },

    // 主动转发，仅标题
    shareAppMessage(title, imageUrl) {
        console.log('[WXHelper.shareAppMessage]');
        wx.shareAppMessage({
            title: title,
            imageUrl: imageUrl,
            success: function (res) {
                console.log('[wx.shareAppMessage] success.');
                console.log(res);
            },
            fail: function (res) {
                console.log('[wx.shareAppMessage] fail.');
                console.log(res);
            },
            complete: function (res) {
                console.log('[wx.shareAppMessage] complete.');
                console.log(res);
            },
        });
    },

    // 主动转发，带查询字符串
    // @param query 类似 k1=v1&k2=v2 格式
    shareAppMessageQuery(title, imageUrl, query, successCallback, failCallback, sceneID) {
        var pw = new PacketWriter();
        pw.writeid(cc.vv.packid.PACKETID_249);
        pw.writeu2(sceneID);
        pw.writeu1(1);
        cc.vv.socketMgr.bufferPack(pw.getdata());
        console.log('[WXHelper.shareAppMessageQuery]');
        console.log(query);
        wx.shareAppMessage({
            title: title,
            query: query,
            imageUrl: imageUrl,
            success: function (res) {
                console.log(res);
                console.log('[wx.shareAppMessage] success.');
                var pw = new PacketWriter();
                pw.writeid(cc.vv.packid.PACKETID_249);
                pw.writeu2(sceneID);
                pw.writeu1(3);
                cc.vv.socketMgr.bufferPack(pw.getdata());
                if (typeof successCallback === "function") {
                    successCallback(res);
                }
            },
            fail: function (res) {
                console.log(res);
                console.log('[wx.shareAppMessage] fail.');
                if (typeof failCallback === "function") {
                    failCallback();
                }
            },
            complete: function (res) {
                console.log('[wx.shareAppMessage] complete.');
                console.log(res);
            },
        });
    },

    // 监听转发事件
    // onShareAppMessage(){
    //     // 用户点击了“转发”按钮
    //     wx.onShareAppMessage(function(){
    //         return {
    //             title:'',
    //         }
    //     });
    // }

    // 对外提供的登录接口
    login() {

        console.log('[WXHelper.login]');

        // 读取本地缓存的sessionid
        // this.loadLocalSessionID();

        // 先获取授权
        this._authorize();
    },

    // 调用微信登录
    _login(_successCb) {
        if (typeof _successCb === "function") {
            var successCb = _successCb;
        }
        console.log('[WXHelper._login]');

        wx.getSetting({
            success: function (res) {
                if (!res.authSetting['scope.userInfo']) {
                    var [screenWidth, screenHeight] = [0, 0];
                    wx.getSystemInfo({
                        success: function (res) {
                            screenWidth = res.screenWidth;
                            screenHeight = res.screenHeight;
                        },
                        fail: function () {
                            console.log('[wx.getSystemInfo] fail.');
                        },
                    });
                    var imgurl = cc.url.raw(cc.GameTexture.wxmingamelogin);
                    const userInfoBtn = wx.createUserInfoButton({
                        type: 'image',
                        image: imgurl,
                        text: '登陆游戏',
                        style: {
                            left: screenWidth / 2 - cc.GameTexture.wxmingamelogin_width / 2,
                            top: screenHeight / 2 - cc.GameTexture.wxmingamelogin_height / 2,
                            width: cc.GameTexture.wxmingamelogin_width,
                            height: cc.GameTexture.wxmingamelogin_height,
                            borderRadius: 4
                        }
                    })
                    userInfoBtn.onTap((res) => {
                        wx.authorize({
                            scope: 'scope.userInfo',
                            success: function () {
                                console.log('[wx.authorize] success.');
                                userInfoBtn.destroy();
                                successCb();
                            },
                            fail: function () {
                                console.log('[wx.authorize] fail.');
                            },
                            complete: function () {
                                console.log('[wx.authorize] complete.');
                            },
                        });
                    })
                }
                else {
                    console.log('authorized.');
                    successCb();
                }
            },
            fail: function (res) {
                console.log('[wx.getSetting] fail.');
            },
            complete: function (res) {
                console.log('[wx.getSetting] complete.');
            },
        });
    },

    // 获取与开发服务器通讯的sessionid
    loadLocalSessionID() {

        console.log('[WXHelper.loadLocalSessionID]');

        if (this.sessionID == null) {
            var session = wx.getStorageSync('SESSION_ID');
            if (session) {
                this.sessionID = session;
                console.log('[WXHelper.loadLocalSessionID] ' + this.sessionID);
            }
            else {
                console.log('[WXHelper.loadLocalSessionID] get sessionid fail.');
            }
        }
    },

    // 请求用户信息
    _getUserInfo(successCb, failCb) {

        console.log('[WXHelper._getUserInfo]');

        // if (this.sessionID === null) {
        //     this.login();
        //     return;
        // }

        // var self = this;

        // console.log('[wx.getUserInfo]');

        // api: https://developers.weixin.qq.com/miniprogram/dev/api/open.html#wxgetuserinfoobject
        wx.getUserInfo({

            withCredentials: true, //是否带上登录态信息 值为true才有openid

            success: (res) => {
                this.userInfoObj = res;
                console.log("[wx.getUserInfo success]");
                if (typeof successCb === "function") {
                    successCb();
                }
                // var rawData = res.rawData;
                // var encryptedData = res.encryptedData;
                // var signature = res.signature;
                // var iv = res.iv;

                // console.log('[wx.request]');

                // wx.request({
                //     url: self.requestURL + 'decrypt',
                //     data: {
                //         sessionID: self.sessionID,
                //         rawData: rawData,
                //         signature: signature,
                //         encryptedData: encryptedData,
                //         iv: iv,
                //     },
                //     // header:{},
                //     method: 'POST',
                //     // dataType:'json',
                //     // responseType:'text',
                //     success: function (res) {
                //         // res.data Object/String/ArrayBuffer
                //         // res.statusCode  Number
                //         // res.header Object

                //         console.log('[wx.getUserInfo.request] success.');
                //         console.log(res);
                //         console.log(res.data);

                //         // #######################
                //         // 最终登入成功的回调在这里

                //         if (res.statusCode === 200) {

                //             /** Login Protocol
                //              *  C->S
                //                 {
                //                     String openid
                //                     String unionid
                //                     String 名字
                //                     String 头像URL(微信中获取)
                //                     Uint8  性别（0=未知/1=男/2=女）
                //                     Uint32 平台id
                //                     String 客户端版本号
                //                     Uint64 邀请者id（通过分享链接点开）
                //                 }
                //              * 
                //              */
                //             var openId = res.data.Data.openId;
                //             self.openId = openId;
                //             var nickName = res.data.Data.nickName;
                //             var avatarUrl = res.data.Data.avatarUrl;
                //             var platformId = 0;
                //             var versionNum = '1.0.0';
                //             var unionId = '';
                //             var gender = res.data.Data.gender;
                //             var inviterId = 0;
                //             var inviterName = "";
                //             var inviterMatchId = 0;


                //             if (typeof res.data.Data.unionId !== 'undefined') {
                //                 unionId = res.data.Data.unionId;
                //             }

                //             var launchOption = wx.getLaunchOptionsSync();
                //             var query = launchOption.query;

                //             if (launchOption.scene == "1104") { //场景值 ： 从我的小程序入口进入
                //                 self._isCollect = true;
                //             }
                //             console.log("wx launch option:");
                //             console.log(launchOption);

                //             if ("undefined" !== typeof query
                //                 && "undefined" !== typeof query.inviterId
                //                 && "undefined" !== typeof query.inviterName) {
                //                 if (launchOption.scene == "1044") { //场景值 ： 带shareTicket 的小程序消息卡片
                //                     if (query.inviterInitType == '1' && query.inviterInitModule == 0
                //                         && query.inviterInitType && query.inviterInitModule) {
                //                         self.shareTicket = launchOption.shareTicket;
                //                     }
                //                 }
                //                 inviterId = parseInt(query.inviterId);
                //                 inviterName = query.inviterName;
                //             }
                //             var pw = new PacketWriter();
                //             pw.writeid(cc.vv.packid.PACKETID_100);
                //             pw.writes(openId);
                //             pw.writes(unionId);
                //             pw.writes(nickName);
                //             pw.writes(avatarUrl);
                //             pw.writeu1(gender);
                //             pw.writeu4(platformId);
                //             pw.writes(versionNum);
                //             pw.writeu8(inviterId);
                //             pw.writes(inviterName);
                //             if ("undefined" !== typeof query.inviterMatchId) {
                //                 inviterMatchId = query.inviterMatchId;
                //                 pw.writeu4(inviterMatchId);
                //             } else {
                //                 pw.writeu4(0);
                //             }
                //             if ("undefined" !== typeof query.inviterSceneID) {
                //                 var sceneID = Number(query.inviterSceneID);
                //                 pw.writeu2(sceneID);
                //                 console.log("场景ID___" + sceneID);
                //             }
                //             cc.vv.socketMgr.bufferPack(pw.getdata());

                //             console.log('[wx.getUserInfo.request] send login request to logic server.');
                //         }
                //     },
                //     fail: function () {
                //         console.log('[wx.getUserInfo.request] fail.');
                //     },
                //     complete: function () {
                //         console.log('[wx.getUserInfo.request] complete.');
                //     },
                // });
            },
        });
    },




    // 登陆时候下载资源
    // downloadAllResources(target, callFunc){
    //     var relatUrl = 'res';
    //     var remoteUrl = wxDownloader.REMOTE_SERVER_ROOT + relatUrl + '.zip';
    //     var localPath = wx.env.USER_DATA_PATH;
    //     var versionUrl = `${wx.env.USER_DATA_PATH}/res_version.txt`;
    //     console.log('--------------->' + remoteUrl);
    //     var self = this;
    //     var fs = wx.getFileSystemManager();
    //     fs.access({
    //         path: localPath + '/' + relatUrl,
    //         success: function () {
    //             console.log('[FileSystemManager.access] success.');

    //             fs.access({
    //                 path: versionUrl,
    //                 success: function () {
    //                     console.log('[FileSystemManager.access versionUrl] success.');

    //                     var resVersionStr = fs.readFileSync(versionUrl, 'utf8');
    //                     if (resVersionStr == wxDownloader.REMOTE_SERVER_ROOT) {
    //                         cc.director.loadScene("match");
    //                     } else {
    //                         fs.unlinkSync(versionUrl);
    //                         self.startDownloadRes(target, callFunc, remoteUrl, localPath, versionUrl);
    //                     }
    //                 },
    //                 fail: function () {
    //                     console.log('[FileSystemManager.access versionUrl] fail.');

    //                     self.startDownloadRes(target, callFunc, remoteUrl, localPath, versionUrl);
    //                 },
    //                 complete: function () {
    //                     console.log('[FileSystemManager.access versionUrl] complete.');
    //                 }
    //             });
    //         },
    //         fail: function (res) {
    //             console.log("[FileSystemManager.access] fail..." + res.errMsg);

    //             self.startDownloadRes(target, callFunc, remoteUrl, localPath, versionUrl);
    //         }
    //     });
    // },

    // // 开始下载
    // startDownloadRes: function (target, callFunc, remoteUrl, localPath, versionUrl) {
    //     var fs = wx.getFileSystemManager();
    //     var downloadTask = wx.downloadFile({
    //         url: remoteUrl,
    //         header: {},
    //         filePath: '',
    //         success: function (res) {
    //             console.log('[wx.downloadfile] success.' + '   ' + res.tempFilePath + '   ' + res.statusCode);

    //             if (res.statusCode === 404) {
    //                 console.log("Download file failed: " + remoteUrl);
    //             }
    //             else if (res.tempFilePath) {
    //                 // http reading is not cached
    //                 console.log('---------->' + localPath);
    //                 fs.unzip({
    //                     zipFilePath: res.tempFilePath,
    //                     targetPath: localPath,
    //                     success: function () {
    //                         console.log("[FileSystemManager.unzip] success.");

    //                         fs.writeFileSync(versionUrl, wxDownloader.REMOTE_SERVER_ROOT, 'utf8');

    //                         cc.director.loadScene("match");
    //                     },
    //                     fail: function () {
    //                         console.log("[FileSystemManager.unzip] fail.");

    //                         cc.director.loadScene("match");
    //                     },
    //                     complete: function () {
    //                         console.log("[FileSystemManager.unzip] complete.");
    //                     },
    //                 });
    //             }
    //         },
    //         fail: function () {
    //             console.log('[wx.downloadfile] fail.');

    //             cc.director.loadScene("match");
    //         },
    //         complete: function () {
    //             console.log('[wx.downloadfile] complete.');
    //         },
    //     });
    //     downloadTask.onProgressUpdate((res) => {
    //         // that.setData({
    //         //     percentVal: res.progress
    //         // });
    //         console.log('下载进度', res.progress)
    //         console.log('已经下载的数据长度', res.totalBytesWritten)
    //         console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
    //         if (callFunc) {
    //             callFunc(target, res.progress);
    //         }
    //     });
    // },

    // 登陆时候下载资源
    downloadAllResources(target, callFunc) {
        var fileArr = cc.GameConst.URL_RES_INCLUDE_FILE;
        // var spriteArr = cc.GameConst.URL_RES_INCLUDE_SPRITE_ATLAS;
        this.downloadTotalCountArr = [];
        this.downloadCompleteCountArr = [];
        this.downloadProgress = 0;
        var self = this;
        for (var i = 0; i < fileArr.length; i++) {
            self.downloadTotalCountArr[i] = 0;
            self.downloadCompleteCountArr[i] = 0;
            (function (i) {
                cc.loader.loadResDir(fileArr[i], function (completedCount, totalCount, item) {
                    // console.log('----------------->' + fileArr[i] + '...   ' + completedCount + '/' + totalCount);
                    self.dealDownloadProgress(self, i, completedCount, totalCount);
                    if (callFunc) {
                        callFunc(target, self.downloadProgress);
                    }
                },
                    function (err, assets) {
                        if (err) {
                            cc.error(err);
                            return;
                        }

                        console.log('[cc.loader.loadResDir] complete...' + fileArr[i]);
                        // console.log(self.downloadCompleteCountArr);
                        // console.log(self.downloadTotalCountArr);
                        // cc.director.loadScene("match");
                    });
            })(i);
        }
        // for (var i = 0; i < spriteArr.length; i++) {
        //     self.downloadTotalCountArr[fileArr.length + i] = 0;
        //     self.downloadCompleteCountArr[fileArr.length + i] = 0;
        //     (function (i) {
        //         cc.loader.loadResDir(spriteArr[i], cc.SpriteFrame, function (completedCount, totalCount, item) {
        //             // console.log('----------------->' + spriteArr[i] + '...   ' + completedCount + '/' + totalCount);
        //             self.dealDownloadProgress(self, fileArr.length + i, completedCount, totalCount);
        //             if (callFunc) {
        //                 callFunc(target, self.downloadProgress);
        //             }
        //         },
        //             function (err, assets) {
        //                 if (err) {
        //                     cc.error(err);
        //                     return;
        //                 }

        //                 console.log('[cc.loader.loadResDir] complete...' + spriteArr[i]);
        //                 // console.log(self.downloadCompleteCountArr);
        //                 // console.log(self.downloadTotalCountArr);
        //                 // cc.director.loadScene("match");
        //             });
        //     })(i);
        // }

        // 加载战斗界面预制件
        // cc.loader.loadRes('prefabs/mj_battle_room_node', function () {
        //     // console.log('---------->load battle room done');
        // });
    },

    // 处理加载资源进度信息
    dealDownloadProgress: function (target, index, completedCount, totalCount) {
        target.downloadTotalCountArr[index] = totalCount;
        target.downloadCompleteCountArr[index] = completedCount;

        if (cc.GameConst.URL_RES_INCLUDE_FILE.length == target.downloadTotalCountArr.length) {
            var cur = target.getProgress(target.downloadCompleteCountArr);
            var max = target.getProgress(target.downloadTotalCountArr);
            this.downloadProgress = (Math.floor(cur / max * 100) >= this.downloadProgress) ? Math.floor(cur / max * 100) : this.downloadProgress;
            // console.log('========================>all file download progress: ' + cur + ' / ' + max + '....' + this.downloadProgress + '%');
        }
    },

    // 获得进度值
    getProgress: function (arr) {
        var num = 0;
        for (var i = 0; i < arr.length; i++) {
            num += arr[i];
        }
        return num;
    },

    setShareCanvasGameAwardData(command, masterPoint, bonus, totalBonus) {
        wx.postMessage({
            command: command,
            nickName: cc.vv.utils.getSubstringDataByLength(cc.vv.myself.playerName),
            headImgUrl: cc.vv.myself.playerIcon,
            masterPoint: masterPoint,
            bonus: bonus,
            totalBonus: totalBonus,
        });
    },

    getCustomShareCanvasToShare(title, query, sceneID) {
        sharedCanvas.toTempFilePath({
            x: 0,
            y: 0,
            width: sharedCanvas.width,
            height: sharedCanvas.height,
            destWidth: 1000,
            destHeight: 800,
            fileType: "png",
            quality: -1.0,
            success: function (res) {
                var imageUrl = res.tempFilePath;
                wx.updateShareMenu({
                    withShareTicket: false,
                    success: function (res) {
                        var pw = new PacketWriter();
                        pw.writeid(cc.vv.packid.PACKETID_249);
                        pw.writeu2(sceneID);
                        pw.writeu1(1);
                        cc.vv.socketMgr.bufferPack(pw.getdata());
                        wx.shareAppMessage({
                            title: title,
                            imageUrl: imageUrl,
                            query: query,
                            success: function (res) {
                                var pw = new PacketWriter();
                                pw.writeid(cc.vv.packid.PACKETID_249);
                                pw.writeu2(sceneID);
                                pw.writeu1(3);
                                cc.vv.socketMgr.bufferPack(pw.getdata());
                            },
                        })
                    },
                });
            }
        });
    },

    //TODO: 对用户拒接授权的处理，wx.createOpenSettingButton  由于官方打开小程序设置页接口，故只能通过创建设置按钮实现再次授权相册
    // api: https://developers.weixin.qq.com/blogdetail?action=get_post_info&lang=zh_CN&token=356396510&docid=00082244e20898b040073de6e5b801
    getScreenCanvasToLocalPath(successCallback, failCallBack) {
        var self = this;
        if (!wx.saveImageToPhotosAlbum) {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
            return;
        }
        wx.getSetting({
            success(res) {
                console.log("getSetting: success");
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    console.log("1-没有授权《保存图片》权限");
                    // 接口调用询问  
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            console.log("2-授权《保存图片》权限成功");
                            var tempFilePath = canvas.toTempFilePathSync({
                                x: 0,
                                y: 0,
                                width: canvas.width,
                                height: canvas.height,
                                destWidth: 1280,
                                destHeight: 720,
                                fileType: "png",
                                quality: -1.0,
                            })
                            wx.saveImageToPhotosAlbum({
                                filePath: tempFilePath,
                                success: function (res) {
                                    if (successCallback != null) {
                                        successCallback();
                                    }
                                }
                            });
                        },
                        fail() {
                            console.log("用户拒绝了授权");
                            if (failCallBack != null) {
                                failCallBack();
                            }
                        },
                    });
                } else {
                    console.log("1-已经授权《保存图片》权限");
                    var tempFilePath = canvas.toTempFilePathSync({
                        x: 0,
                        y: 0,
                        width: canvas.width,
                        height: canvas.height,
                        destWidth: canvas.width,
                        destHeight: canvas.height,
                        fileType: "png",
                        quality: -1.0,
                    })
                    wx.saveImageToPhotosAlbum({
                        filePath: tempFilePath,
                        success: function (res) {
                            if (successCallback != null) {
                                successCallback();
                            }
                        }
                    });
                }
            },
        })
    },

    //TODO: 由于微信不支持把临时文件保存到子域res文件夹，子域也不能访问主域的res文件夹
    //帖子链接：https://developers.weixin.qq.com/blogdetail?action=get_post_info&lang=zh_CN&token=1608975854&docid=00048689504138cd3007e49ea56800
    //2.creator的加载远程资源的接口仅支持加载:图片（cc.Texture2D），声音（cc.AudioClip），粒子（cc.ParticleAsset）
    //api http://docs.cocos.com/creator/manual/zh/scripting/load-assets.html
    downloadSharedCanvasResources() {
        var fs = wx.getFileSystemManager();
        wx.downloadFile({
            url: wxDownloader.REMOTE_SERVER_ROOT + 'fzmj_match_sharedCanvas_res/share_bg.png', //仅为示例，并非真实的资源
            success: function (res) {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                if (res.statusCode === 200) {
                    wx.postMessage({
                        command: 'bgRes',
                        path: res.tempFilePath
                    });
                }
            }
        });
        wx.downloadFile({
            url: wxDownloader.REMOTE_SERVER_ROOT + 'fzmj_match_sharedCanvas_res/yuan.png', //仅为示例，并非真实的资源
            success: function (res) {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                if (res.statusCode === 200) {
                    wx.postMessage({
                        command: 'yuanRes',
                        path: res.tempFilePath
                    });
                }
            }
        });
    },

    getFriendRank() {
        wx.postMessage({
            command: "friendRank",
            keyData: [this.weChatKey[0], this.weChatKey[1]],
        });
    },

    getAnswerRank() {
        wx.postMessage({
            command: "getAnswerChange",
            keyData: this.weChatKey[2],
            myOpenId: this.openId,
            myName: cc.vv.myself.playerName,
            myHeadUrl: cc.vv.myself.playerIcon,
            myTime: cc.vv.myself.answerCounTime,
        });
    },

    friendRankPageActiveChange(index) {
        wx.postMessage({
            command: "pageChange",
            pIndex: index,
            myOpenId: this.openId
        });
    },

    setRankHeight(index) {
        wx.postMessage({
            command: "RankHeight",
            keyData: this.RankHeight[index],
        });
    },

    setConfigFriendRankData(keyArr, bonusData, masterPointData, answerTime) {
        wx.postMessage({
            command: 'setRankData',
            keyData: [
                {
                    key: keyArr[0],
                    data: bonusData
                },
                {
                    key: keyArr[1],
                    data: masterPointData
                },
                {
                    key: keyArr[2],
                    data: answerTime
                },
            ],
        });
    },

    setMoveTouchDeltaY(deltaY) {
        wx.postMessage({
            command: 'moveTouch',
            y: deltaY,
        });
    },

    setMoveTouchOff() {
        wx.postMessage({
            command: 'moveTouchOff',
        });
    },

    setSharedCanvasChildrenActive(pIndex) {
        wx.postMessage({
            command: "shareCanvasChange",
            pIndex: pIndex
        });
    },

    setSharedCanvasSize(width, height) {
        sharedCanvas.width = width;
        sharedCanvas.height = height;
    },

    setSharedCanvasDesignResolution(width, height) {
        wx.postMessage({
            command: 'designResolution',
            designWidth: width,
            designHeight: height,
        });
    },

    getSurpassFriendData() {
        wx.postMessage({
            command: 'surpassFriendRank',
            keyData: this.weChatKey[0],
            myOpenId: this.openId
        });
    },



    initLoadGroupRankVieW() {
        var self = this;
        wx.postMessage({
            command: "groupRank",
            shareTicket: self.shareTicket,
            keyData: self.weChatKey,
            myOpenId: self.openId,
            initGroupIndex: 0,
        });
        self.setSharedCanvasSize(self._groupRankCanvasWidth, self._groupRankCanvasHeight);
        self.setSharedCanvasDesignResolution(self._groupRankCanvasWidth, self._groupRankCanvasHeight);
        self.setSharedCanvasChildrenActive(1);
    },

    keepScreenOn() {

        if (wx.setKeepScreenOn) {
            wx.setKeepScreenOn({
                keepScreenOn: true,
                success: function () {
                    console.log('[wx.setKeepScreenOn] success.');
                },
                fail: function () {
                    console.log('[wx.setKeepScreenOn] fail.');
                },
                complete: function () {
                    console.log('[wx.setKeepScreenOn] complete.');
                },
            });
        }
    },

};
module.exports = WXHelper;
cc.WXHelper = WXHelper;