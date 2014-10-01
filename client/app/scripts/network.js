define(['SocketIO'], function(io) {
    'use strict';
    function NetworkEngine(Game, _parameters) {
        var parameters = _parameters || {};
        var players = {};
        this.socket = new io();
        this.id = null;
        this.socket.on('set id', function(id) {
            this.id = id;
        }.bind(this));

        this.socket.emit('new player', {
            name: parameters.playerName || 'Default player'
        });

        this.socket.on('player list', function(list) {
            for(var i=0; i<list.length; ++i) {
                var player = list[i];
                this.addPlayer(player);
            }
        }.bind(this));

        this.addPlayer = function(player) {
            players[player.id] = player;
            if(player.id != this.id && this.onNewPlayer) {
                this.onNewPlayer(player);
            }
        }.bind(this);

        this.socket.on('new player', this.addPlayer);
        this.socket.on('position', function(position) {
            if(this.onPosition) {
                var player = this.findPlayerByMessage(position);
                if(player) {
                    this.onPosition(player, position);
                }
            }
        }.bind(this));

        this.socket.on('spawn', function(spawnData) {
            if(this.onPlayerSpawn) {
                var player = this.findPlayerByMessage(spawnData);
                if(player) {
                    this.onPlayerSpawn(player, spawnData);
                }
            }
        }.bind(this));

        this.socket.on('ping', function(data) {
              this.socket.emit('pong', data);
        }.bind(this));

        this.socket.on('chat', function(message) {
            message.player = this.findPlayerByMessage(message);
            for(var i=0; i < this.chatMessageListeners.length; ++i) {
                this.chatMessageListeners[i](message);
            }
        }.bind(this));

        this.findPlayerByMessage = function(message) {
            return players[message.player];
        };
        this.game = Game;
    };
    NetworkEngine.prototype.spaceship = null;
    NetworkEngine.prototype.chatMessageListeners = [];
    NetworkEngine.prototype.onNewPlayer = null;
    NetworkEngine.prototype.onByePlayer  = null;
    NetworkEngine.prototype.onPlayerSpawn = null;
    NetworkEngine.prototype.onPosition = null;

    NetworkEngine.prototype.sendPosition = function() {
        if(this.spaceship != null) {
            this.socket.emit('position', this.spaceship.serialize());
        }
    };

    NetworkEngine.prototype.sendShot = function(shot) {
        this.socket.emit('shot', shot);
    };

    NetworkEngine.prototype.sendChatMessage = function(message) {
        this.socket.emit('chat', message);
    };
    NetworkEngine.prototype.spawn = function(spaceship) {
        this.spaceship = spaceship;
        this.socket.emit('spawn', {
            maxVelocity: spaceship.maxVelocity
        });
        this.sendPosition();
    };
    NetworkEngine.prototype.die = function() {
        this.sendPosition();
        this.socket.emit('die', {});
        this.spaceship = null;
    };

    NetworkEngine.prototype.update = function(Core, delta) {
        this.sendPosition();
    };

    return NetworkEngine;
});
