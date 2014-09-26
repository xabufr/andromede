define(['SocketIO'], function(io) {
    'use strict';
    function NetworkEngine(Game, _parameters) {
        var parameters = _parameters || {};
        var players = {};
        this.socket = new io();

        this.socket.emit('new player', {
            name: parameters.playerName || 'Default player'
        });

        this.socket.on('player list', function(list) {
            for(var i=0; i<list.length; ++i) {
                var player = list[i];
                var id = player.id;
                players[id] = player;
            }
        }.bind(this));

        this.socket.on('ping', function(data) {
              this.socket.emit('pong', data);
        }.bind(this));

        this.socket.on('chat', function(message) {
            message.player = players[message.player];
            for(var i=0; i < this.chatMessageListeners.length; ++i) {
                this.chatMessageListeners[i](message);
            }
        }.bind(this));
    };

    NetworkEngine.prototype.chatMessageListeners = [];

    NetworkEngine.prototype.sendPosition = function(spaceship) {
        this.socket.emit('position', {
            position: {
                x: spaceship.mesh.position.x,
                y: spaceship.mesh.position.y,
                z: spaceship.mesh.position.z
            },
            rotation: {
                x: spaceship.mesh.quaternion.x,
                y: spaceship.mesh.quaternion.y,
                z: spaceship.mesh.quaternion.z,
                w: spaceship.mesh.quaternion.w
            }
        });
    };

    NetworkEngine.prototype.sendShot = function(shot) {
        this.socket.emit('shot', shot);
    };

    NetworkEngine.prototype.sendChatMessage = function(message) {
        this.socket.emit('chat', message);
    };

    return NetworkEngine;
});
