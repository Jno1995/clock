// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property({
        displayName: "倒计时文本",
        type: cc.Node
    })
    lCountDown: cc.Node;

    @property({
        displayName: "数字按键预制",
        type: cc.Prefab
    })
    inputNumber: cc.Prefab;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var nextTime = cc.sys.localStorage.getItem('nextTime');
        if (nextTime) {
            var t_difference = cc.Utils.formatDuring(nextTime);
            cc.find("Canvas/n_layout/l_countDown").getComponent(cc.Label).string = t_difference;
            cc.find("Canvas/n_layout/l_countDown").getComponent("CountDown")._nextTime = nextTime;
        }
    }

    start () {
        this.initListenHandlers();
        var nowData = Date.parse(new Date()) / 1000;
        var hms = cc.Utils.getTimeStampToNow(nowData, ["/","/",""], "ALL");
        cc.find("Canvas/n_layout/l_nowTime_value").getComponent(cc.Label).string = hms;
        setInterval(()=>{
            var nowData = Date.parse(new Date()) / 1000;
            var hms = cc.Utils.getTimeStampToNow(nowData, ["/","/",""], "ALL");
            cc.find("Canvas/n_layout/l_nowTime_value").getComponent(cc.Label).string = hms;
        }, 1000);
    }

    initListenHandlers () {
        this.lCountDown.on(cc.Node.EventType.TOUCH_START, this.onLCountDownTouchEvent, this);
    }

    onLCountDownTouchEvent () {
        if (!this.inputNode) {
            this.inputNode = cc.instantiate(this.inputNumber);
            this.node.addChild(this.inputNode);
        }
        else {
            this.inputNode.y = 0;
            this.inputNode.opacity = 255;
            this.inputNode.getComponent("InputNumber").onResetBtnClicked();
        }
        
    }
    // onTouchEvent () {

    // }

    // update (dt) {}
}
