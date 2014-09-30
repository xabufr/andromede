define([], function() {
    function Chat(Main, Core) {
        this.main = Main;
        this.core = Core;
        this.core.input.keyboard.listeners.push(this.keydown.bind(this));
        this.chatElement = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.main.network.chatMessageListeners.push(this.addMessage.bind(this));
    }
    Chat.prototype.typing = false;
    Chat.prototype.keydown = function(event, isDown) {
        if(!this.typing && event.keyCode === 67 && isDown) {
            event.preventDefault();
            this.typing = true;
            this.main.lockKeyboard(this.keydown.bind(this));
            this.startChat();
        } else if(this.typing && (event.keyCode === 13 || event.keyCode === 27) && isDown) {
            event.preventDefault();
            this.typing = false;
            this.main.unlockKeyboard();
            this.stopChat();
            if(event.keyCode === 13) {
                this.sendMessage();
            }
        }
    };
    Chat.prototype.startChat = function() {
        this.chatInput.style.display = 'inline';
        this.chatInput.focus();
        this.chatInput.value = '';
    };
    Chat.prototype.stopChat = function() {
        this.chatInput.style.display = 'none';
    };
    Chat.prototype.sendMessage = function() {
        this.main.network.sendChatMessage(this.chatInput.value);
    };
    Chat.prototype.update = function(delta) {
    };
    Chat.prototype.addMessage = function(message) {
        var messageElement = document.createElement('div');
        messageElement.className = 'message';
        var pseudo = document.createElement('span');
        pseudo.appendChild(document.createTextNode(message.player.name));
        pseudo.className = 'pseudo';
        messageElement.appendChild(pseudo);
        messageElement.appendChild(document.createTextNode(message.message));
        this.chatElement.appendChild(messageElement);
        setTimeout(function() {
            this.chatElement.removeChild(messageElement);
        }.bind(this), 5000);
    };

    return Chat;
});
