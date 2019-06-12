"use strict";
cc._RF.push(module, '468474JWMhI67G6Vfzu6xbU', 'AudioMgr');
// scripts/contorl/AudioMgr.js

'use strict';

var AudioMgr = {
    bgmVolume: 0.8,
    sfxVolume: 0.8,
    //开关
    bgmswitch: 1,
    sfxswitch: 1,

    bgmAudioID: -1,
    sfxAudioID: -1,

    bgm_v: 0,
    sfx_v: 0,

    init: function init() {
        var setting = cc.vv.localData.setting;
        this.bgmVolume = setting.sound_volum;
        this.sfxVolume = setting.sfx_volum;
        this.bgmswitch = setting.sound_switch;
        this.sfxswitch = setting.sfx_switch;
        console.log(setting.sound_volum);
        console.log(setting.sound_switch + '音量开关');
        console.log(setting.sfx_volum);
        console.log(setting.sfx_switch + '音效开关');
    },

    getUrl: function getUrl(url) {
        return cc.url.raw("resources/audio/" + url);
    },

    playBGM: function playBGM() {
        if (cc.vv.localData.setting.sound_switch == 0) {
            return;
        }
        if (this.bgmAudioID == -1) {
            var audioUrl = this.getUrl("background.mp3");
            this.bgmAudioID = cc.audioEngine.play(audioUrl, true, cc.vv.localData.setting.sound_volum);
        }
    },


    // 播放音效
    playEffect: function playEffect(url) {
        if (cc.vv.localData.setting.sfx_switch == 1) {
            if (null != url) {
                this.sfxAudioID = cc.audioEngine.play(cc.url.raw(url), false, this.sfxVolume);
            }
        }
    },

    setSFXVolume: function setSFXVolume(v, force) {
        if (this.sfxVolume != v || force) {
            this.sfxVolume = v;
            cc.audioEngine.setVolume(this.sfxAudioID, v);
        }
    },

    setBGMVolume: function setBGMVolume(v, force) {
        if (this.bgmVolume != v || force) {

            this.bgmVolume = v;
            cc.audioEngine.setVolume(this.bgmAudioID, v);
        }
    },

    playClickedBgm: function playClickedBgm() {
        if (cc.vv.localData.setting.sfx_switch != 1) {} else {
            this.playEffect("resources/audio/button_click.mp3");
        }
    },
    getBGMState: function getBGMState() {
        return cc.audioEngine.getState(this.bgmAudioID);
    },
    stopBGM: function stopBGM() {
        if (this.bgmAudioID != -1) {
            cc.audioEngine.stop(this.bgmAudioID);
            this.bgmAudioID = -1;
        }
    }
};
module.exports = AudioMgr;

cc._RF.pop();