define(['./chat'], function(Chat) {
    function UiMain(Core, network) {
        this.core = Core;
        this.network = network;
        this.chatElement = new Chat(this, Core);
    }
    UiMain.prototype.lockKeyboard = function(listener) {
        this.core.input.keyboard.notifyOnly = listener;
    };
    UiMain.prototype.unlockKeyboard = function() {
        this.core.input.keyboard.notifyOnly = false;
    };
    return UiMain;
});
