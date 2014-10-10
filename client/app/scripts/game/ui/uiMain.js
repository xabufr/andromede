define(['./chat', './cursor', './progressBar', './objectscreentracker'], function(Chat, Cursor, ProgressBar, ObjectScreenTracker) {
    'use strict';
    function UiMain(Core, network) {
        this.core = Core;
        this.network = network;
        this.chatElement = new Chat(this, Core);
        this.cursor = new Cursor();
        this.lifeBar = new ProgressBar();
        this.trackers = {};
    }
    UiMain.prototype.lockKeyboard = function(listener) {
        this.core.input.keyboard.notifyOnly = listener;
    };
    UiMain.prototype.unlockKeyboard = function() {
        this.core.input.keyboard.notifyOnly = false;
    };
    UiMain.prototype.update = function(Core, delta, localShip) {
        this.cursor.move(Core);
        if(localShip) {
            this.lifeBar.setValue(localShip.lifePercent());
        }
        var keys = Object.keys(this.trackers);
        for(var i=0;i<keys.length;++i) {
            this.trackers[keys[i]].update(Core, delta);
        }
    };
    UiMain.prototype.createScreenTracker = function(object3d, element) {
        var id = Math.random();
        this.trackers[id] = new ObjectScreenTracker(id, object3d, element);
    };
    return UiMain;
});
