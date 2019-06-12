cc.Class({
    extends: cc.Component,

    properties: {
        option: null,
        setting: null,
    },

    init() {

        this.option = {
            optionsum: 4,
            jushu: 4,//4局
            jifen: 6,//放胡单赔
            renshu: 9,//4人局
            fangfei: 14,//房主付费     
            //福州麻将玩法
            qingyise: 1,
            jinlong: 0,
            jinkan: 0,
            //宁德麻将玩法
            duiduihu: 0,
            //房费
            roomPrice: 2
        };

        this.setting = {
            sound_volum: 1,
            sfx_volum: 1,
            sound_switch: 1,
            sfx_switch: 1,
            //table_color: 0, // 桌布颜色：0：绿色；1：蓝色
            //ting_tip_type: 0, // 听牌提示：0：开启；1：关闭
            lan_type: 1, // 配音语言：0：普通话；1：本地话
            lan_sex: 0, // 配音性别：0：男声；1：女声
            no_warning_match_id: 0, // 不再提醒的比赛id
        };

        this.loadOption();
        this.loadSetting();
    },

    loadOption() {
        if (cc.vv.wxHelper.iswxPlatform()) {
            console.log('In Weixin');
            var optionstorage = wx.getStorageSync('option');
            console.log(typeof (optionstorage));
            if (typeof (optionstorage) != "string") { //对象为空的话  类型为string
                this.option = optionstorage;
            }
            // wx.getStorage({ // 异步缓存只能在本次页面生命周期中提取到set的数据 方法保留
            //   key: 'option',
            //   success: function(res) {
            //     console.log(res)
            //     this.option = res.data;
            //   },
            // })
        } else {
            var storagestr = JSON.parse(cc.sys.localStorage.getItem("option"));
            if (storagestr != null) {
                for (var key in storagestr) {
                    this.option[key] = storagestr[key];
                }
            }

        }
    },

    loadSetting() {
        if (cc.vv.wxHelper.iswxPlatform()) {
            var settingstorage = wx.getStorageSync('setting');
            console.log(typeof (settingstorage));
            if (typeof (settingstorage) != "string") {
                this.setting = settingstorage;
            }
        } else {
            var storagestr = JSON.parse(cc.sys.localStorage.getItem("setting"));
            if (storagestr != null) {
                for (var key in storagestr) {
                    this.setting[key] = storagestr[key];
                }
            }
        }
    },

    saveOption() {
        if (cc.vv.wxHelper.iswxPlatform()) {
            wx.setStorageSync('option', this.option);
        } else {
            cc.sys.localStorage.setItem("option", JSON.stringify(this.option));
        }
        // wx.setStorage(
        //   {
        //     key: 'option',
        //     data: this.option,
        //     success: function(res) {
        //       console.log(res)
        //     }
        //   }
        // )
    },
    saveSetting() {
        if (cc.vv.wxHelper.iswxPlatform()) {
            wx.setStorageSync('setting', this.setting);
        } else {
            cc.sys.localStorage.setItem("setting", JSON.stringify(this.setting));
        }

        // wx.setStorage(
        //   {
        //     key: 'setting',
        //     data: this.setting,
        //     success: function(res) {
        //       console.log(res)
        //     }
        //   }
        // )
    }

    // update (dt) {},
});