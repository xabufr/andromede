define(['./chat', './cursor'], function(Chat, Cursor) {
    'use strict';
    function UiMain(Core, network) {
        this.core = Core;
        this.network = network;
        this.chatElement = new Chat(this, Core);
        this.cursor = new Cursor();
    }
    UiMain.prototype.lockKeyboard = function(listener) {
        this.core.input.keyboard.notifyOnly = listener;
    };
    UiMain.prototype.unlockKeyboard = function() {
        this.core.input.keyboard.notifyOnly = false;
    };
    UiMain.prototype.update = function(Core, delta) {
            this.cursor.move(Core);
        }
    return UiMain;
});
