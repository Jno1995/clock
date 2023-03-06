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
    _nextTime: number = 0;

    // onLoad () {}
    start () {
        var labelComp = this.node.getComponent(cc.Label);
        var interval = setInterval(()=> {
            if (this._nextTime !== 0) {
                labelComp.string = cc.Utils.formatDuring(this._nextTime);

                if  (labelComp.string.indexOf("time is up") >= 0) {
                    clearInterval(interval);
                }
            }
        }, 1000);
    }
    
    update () {
        
    }
}
