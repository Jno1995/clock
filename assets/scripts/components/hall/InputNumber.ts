const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({
        type: cc.Integer,
    })
    _inputCount: number = 0;
    _timeNum: number[] = [];
    @property({
        type: cc.Node,
        displayName: "数字输入框"
    })
    inputBox: cc.Node;

    start () {
        this.initListenHandlers();
    }

    initListenHandlers () {
        cc.find("content/title",this.node).on(cc.Node.EventType.TOUCH_START, ()=> {
            this.closePanelEvent();
        });
    }

    closePanelEvent () {
        this.node.y = -640;
        this.node.opacity = 0;
        this._inputCount = 0;
    }

    onNumBtnClicked (event, CustomEventData) {
        if (this._inputCount < 6) {
            if (this._inputCount === 2 || this._inputCount == 4) {
                if (CustomEventData >= 6) {
                    CustomEventData = 5;
                }
            }
            this._timeNum[this._inputCount] = CustomEventData;
            this.inputBox['children'][this._inputCount]['children'][0].getComponent(cc.Label).string = CustomEventData;
            this._inputCount++;
            if (this._inputCount == 6) {
                
                var hour = Number(this._timeNum[0] + this._timeNum[1]);
                var minute = Number(this._timeNum[2] + this._timeNum[3]);
                var second = Number(this._timeNum[4] + this._timeNum[5]);

                var _Date = new Date();
                var year = _Date.getUTCFullYear();
                var month = Number(_Date.getUTCMonth()) + 1;
                var _month = month < 10 ? "0" + month : month;
                var day = Number(_Date.getUTCDate());
                var _day = day < 10 ? "0" + day : day;

                var t_next = Date.parse(`${_month} ${_day} ${year} ${hour}:${minute}:${second}`);

                if (t_next && Number(t_next) > cc.Utils.getNowTimeStamp() * 1000) {
                    //关闭界面 刷新大厅倒计时文本  并且启动倒计时
                    this.closePanelEvent();
                    //t_next 是一个时间戳值
                    cc.sys.localStorage.setItem('nextTime', t_next.toString());
                                    
                    var t_difference = cc.Utils.formatDuring(t_next);

                    cc.find("Canvas/n_layout/l_countDown").getComponent(cc.Label).string = t_difference;
                    cc.find("Canvas/n_layout/l_countDown").getComponent("CountDown")._nextTime = t_next;
                } else {
                    //因输入的值比当前时间小，所以清空已输入的数值
                    this.cleanAllInputNumber();
                }
            }
        } else {
            return;
        }
    }

    onResetBtnClicked () {
        for (var i=0; i<this.inputBox['children'].length; i++) {
            this.inputBox['children'][i]['children'][0].getComponent(cc.Label).string = '';
        }
    }

    onCleanBtnClicked () {
        if (this._inputCount == 0) {
            return;
        } else {
            this.inputBox['children'][this._inputCount - 1]['children'][0].getComponent(cc.Label).string = '';
            this._inputCount--;
        }
    }

    cleanAllInputNumber () {
        for (var i = 0, len = this.inputBox.childrenCount; i < len; i++) {
            this.inputBox.children[i].children[0].getComponent(cc.Label).string = "";
        }
        this._inputCount = 0;
    }
}
