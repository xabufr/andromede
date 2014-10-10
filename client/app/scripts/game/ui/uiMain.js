define(['./chat', './cursor', './progressBar'], function(Chat, Cursor, ProgressBar) {
    'use strict';
    function UiMain(Core, network) {
        this.core = Core;
        this.network = network;
        this.chatElement = new Chat(this, Core);
        this.cursor = new Cursor();
        this.lifeBar = new ProgressBar();
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
    };
    return UiMain;
});
