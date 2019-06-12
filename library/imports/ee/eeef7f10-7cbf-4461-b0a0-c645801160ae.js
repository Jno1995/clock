"use strict";
cc._RF.push(module, 'eeef78QfL9EYbCgxkWAEWCu', 'GameConfig');
// scripts/config/GameConfig.js

"use strict";

var GameConfig = {
    "gameName": "CollideBrick",
    "gameAutor": "zhefeng.zhang",
    "gameVersion": "1.0.0",
    "designHeight": 1920,
    "designWidth": 1080,
    "fitHeight": false,
    "fitWidth": true,
    "CocosCreatorVersion": "2.0.9",
    //saolei
    ip: "websocket.windgzs.cn",
    // ip: "127.0.0.1",
    wxUserInfo: [],
    getUserInfoBtn: null,
    isClickCd: false,
    iType: 0, //0经典，1挑战，2回放，3雷之大陆，4变成地雷
    iDiff: 0,
    tScore: [],
    tName: [],
    tPlaybackData: null,
    sName: "",
    msgBox: null, //断线重连
    iWorldLv: 0, //挑战第几关

    //event
    REGISTER: "register",
    LOGIN: "login",
    GET_SCORE: "getScore",
    GET_STEP: "getStep",
    GET_RANK: "getRank",
    SET_STEP: "setStep",
    WXLOGIN: "wxLogin",
    GET_WORLD_STEP: "getWorldStep"

};
module.exports = GameConfig;
cc.GameConfig = GameConfig;

cc._RF.pop();