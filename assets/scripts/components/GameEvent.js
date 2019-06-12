let GameEvent = {
    // websocket连接
    EVENT_WSS_OPEN: 'wss_open',
    EVENT_WSS_CLOSED: 'wss_closed',

    // login

    EVENT_WX_LOGIN_STATE: 'wx_login_state', // 微信登录状态
    EVENT_WX_QUERY: 'wx_query', // 加载时获取到查询参数

    // 前后台切换

    EVENT_ENTER_FOREGROUND: 'enter_foreground', // 切前台，基于微信小游戏sdk wx.onHide
    EVENT_ENTER_BACKGROUND: 'enter_background', // 切后台，基于微信小游戏sdk wx.onShow

    EVENT_AUDIO_INTERRUPTION_BEGIN: 'EVENT_AUDIO_INTERRUPTION_BEGIN',
    EVENT_AUDIO_INTERRUPTION_END: 'EVENT_AUDIO_INTERRUPTION_END',

    //公告 230
    //活动信息 238
    EVENT_HALL_PREPARE: "hall_prepared",

    //收到新消息
    EVENT_NEW_MESSAGE: "",

    EVENT_MESSAGE_READED: "message_readed",  // 消息全部已读

    //排行榜变更

    // 房间

    EVENT_MEMBER_CHANGE: "member_change", // 成员变换
    EVENT_GAME_BEGIN: "game_begin",  // 游戏开始
    EVENT_GAME_SETTLEMENT: "game_settlement", // 游戏回合结算
    EVENT_GAME_OVER: "game_over", // 游戏结束
    EVENT_ROOM_CLOSED: "room_closed", // 房间关闭
    EVENT_ROOM_VOTE_DISBAND: "room_vote_disband", // 房间投票解散
    EVENT_GAME_DISBAND_SETTLEMENT: "game_disband_settlement", // 游戏解散房间结算

    EVENT_AUTOMATIC_CHANGED: "automatic_changed", // 托管状态改变
    EVENT_INTERACTIVE: "interactive_play", // 道具互动
    // 打牌

    EVENT_MJ_NEWCMD: "newcmd", // 操作序列
    EVENT_MJ_CMDRESPOND: "cmdrespond", // 操作响应

    EVENT_MJ_MOPAI: "mopai",
    EVENT_MJ_BUHUA: "buhua",
    EVENT_MJ_CHI: "chi",
    EVENT_MJ_PENG: "peng",
    EVENT_MJ_GANG: "gang",
    EVENT_MJ_ANGANG: "angang",
    EVENT_MJ_JIAGANG: "jiagang",
    EVENT_MJ_DA: "da",
    EVENT_MJ_TING: "ting", // 听金坎操作
    EVENT_MJ_KAIJIN: "kaijin",
    EVENT_MJ_GOLDCAMP: "goldCamp",  // 434协议状态
    EVENT_MJ_MOON: "moon",

    // 设置
    EVENT_SETTING_TING: "setting_ting", // 设置中改变了听牌提示状态

    // 比赛

    EVENT_MATCH_STATE_CHANGED: "match_state_changed",

    EVENT_MATCH_ENTER_HALL: "match_back_hall",  // 回到大厅

    EVENT_MATCH_COMPLETED_RESULT_SHOW: 'match_completed_result_show', // 显示挑战结束

    EVENT_MATCH_AWARD_SHARE: 'match_award_share', // 比赛奖金分享

    EVENT_MATCH_MATCHING_SHOW: 'match_matching_show', // 显示匹配中

    // 答题
    EVENT_BREAK_SHARE: 'answer_break_share', // 大关卡分享
    EVENT_BACK_HALL: 'answer_back_hall', // 返回大厅
    // EVENT_HALL_SHARE:'answer_hall_share',// 大厅分享
    EVENT_START_TIME: 'answer_start_time',// 开始游戏倒计时
    EVENT_UPDATE_HEART: 'answer_update_heart',// 刷新心数
    
    // 大厅事件
    EVENT_INIT_MAPDATA_COMPLETE : 'init_mapdata_complete', //地图数据初始化完成

    EVENT_GAME_RESTART: "game_restart", //重启游戏

    EVENT_GAME_WIN: "game_win", //赢得游戏
    
    handlers: null,

    init: function () {
        this.handlers = {};
    },

    dispatchEvent: function (event, data) {
        if (this.handlers[event]) {

            console.log("HANDLER " + event);

            for (var tar in this.handlers[event]) {
                this.handlers[event][tar](data);
                // if (event == '_PACKET_330') break; // 特殊事件处理
            }
        }
        else {
            console.log("NO HANDLER " + event);
        }
    },

    addEventHandler: function (event, fn, target) {

        if (this.handlers[event]) {
            // console.log("event:" + event + " handler has been registered.");
            // return;
        }
        else {
            this.handlers[event] = {};
        }

        var handler = function (data) {
            fn(data);
        };

        this.handlers[event][target.__instanceId] = handler;

    },

    removeEventHandler: function (event, target) {

        console.log("removeEvent: " + event + " targetId: " + target.__instanceId);

        if (this.handlers[event] && this.handlers[event][target.__instanceId]) {
            delete (this.handlers[event][target.__instanceId]);
            // delete empty event
            // delete(this.handlers[evnet]);
        }

        // this.dumpEventHandlers();
    },

    dumpEventHandlers() {
        console.log("dumpEventHandlers begin");
        for (var evt in this.handlers) {
            console.log("--" + evt);
            // console.log(this.handlers[evt]);
            for (var tar in this.handlers[evt]) {
                console.log("  --" + typeof (tar) + " " + typeof (this.handlers[evt][tar.__instanceId]));
            }
        }
        console.log("dumpEventHandlers end");
    },
};
module.exports = GameEvent;
cc.GameEvent = GameEvent;