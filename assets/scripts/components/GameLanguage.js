const GameLanguage = {};
GameLanguage.zhLanguage = [
    "游戏版本:",  //0
    "游戏作者:",  //1
    "你赢了",  //2
    "你输了",  //3
    "暂停",  //4
    "{0}:{1}:{2}",  //5
    "挑战超时",  //6
    "暂无成功记录"  //7
];
GameLanguage.enLanguage = [
    "gameVersion:",
    "gameAutor",
    "You Win",
    "You Lose",
    "pause",
    "{0}:{1}",
    "challengeTimeout",
    "noRecordOfSuccess",
];
module.exports = GameLanguage;
cc.GameLanguage = GameLanguage;