define(['./chat', './cursor', './progressBar', './objectscreentracker'], function(Chat, Cursor, ProgressBar, ObjectScreenTracker) {
    'use strict';
    function UiMain(Core, network) {
        this.core = Core;
        this.network = network;
        this.chatElement = new Chat(this, Core);
        this.cursor = new Cursor();
        this.lifeBar = new ProgressBar('life');
        this.energyBar = new ProgressBar('energy');
        this.energyBar.setPosition({x: 0, y: 11});
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
            this.energyBar.setValue(localShip.energyPercent());
        }
        var keys = Object.keys(this.trackers);
        for(var i=0;i<keys.length;++i) {
            this.trackers[keys[i]].update(Core, delta);
        }
    };
    UiMain.prototype.createScreenTracker = function(object3d, element) {
        var id = String(Math.random());
        var objectScreenTracker = new ObjectScreenTracker(id, object3d, element);
        this.trackers[id] = objectScreenTracker;
        return objectScreenTracker;
    };
    UiMain.prototype.deleteScreenTracker = function(tracker) {
        this.trackers[tracker.id].remove();
        delete this.trackers[tracker.id];
    };
    return UiMain;
});
