define([], function() {
    'use strict';
    var AudioContext = (window.AudioContext || window.webkitAudioContext || null);
    if(!AudioContext) {
        throw new Error('Sound engine cannot initialize');
    }
    var ctx = new AudioContext();
    var buffers = {};
    function SoundEngine() {
        this.ctx = ctx;
        this.mainVolume = this.ctx.createGain();
        this.mainVolume.connect(this.ctx.destination);
    }

    SoundEngine.prototype.setVolume = function(vol) {
        this.mainVolume.gain.value = vol;
    };

    SoundEngine.prototype.playSingle = function(soundName, parameters) {
        parameters = parameters || {};
        var buffer = SoundEngine.getBuffer(soundName);
        var spatialized = parameters.position != null;
        var sound = {
            source: this.ctx.createBufferSource(),
            volume: this.ctx.createGain(),
            disconnect: function() {
                this.source.disconnect();
                this.volume.disconnect();
            }
        };
        sound.source.buffer = buffer;
        sound.source.connect(sound.volume);
        sound.volume.connect(this.mainVolume);
        sound.source.start(this.ctx.currentTime);
        sound.source.onended = function() {
            sound.disconnect();
        };
    };

    SoundEngine.getBuffer = function(key) {
        return buffers[key];
    };

    SoundEngine.register = function(data) {
        ctx.decodeAudioData(data.result, function(buffer) {
            buffers[data.data.key] = buffer;
        });
    };

    return SoundEngine;
});
