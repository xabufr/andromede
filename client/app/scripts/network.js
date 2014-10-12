define(['SocketIO'], function(io) {
    'use strict';
    function NetworkEngine(Game, _parameters) {
        var parameters = _parameters || {};
        var players = {};
        this.socket = new io();
        this.socket.on('disconnect', function() {
            this.socket = null;
        }.bind(this));
        this.id = null;
        this.socket.on('set id', function(id) {
            this.id = id;
            if(this.onConnected) {
                this.onConnected(id);
            }
        }.bind(this));

        this.socket.emit('new player', {
            name: parameters.playerName || 'Default player'
        });

        this.socket.on('die', function(playerId) {
            if(this.onShipDie) {
                this.onShipDie(players[playerId]);
            }
        }.bind(this));

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
                    this.onPosition(player, position.data);
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

        this.socket.on('bye player', function(playerId) {
            var player = players[playerId];
            if(player) {
                if(this.onByePlayer) {
                    this.onByePlayer(player);
                }
                delete players[playerId];
            }
        }.bind(this));

        this.socket.on('shot', function(shotData) {
            if(this.onShot) {
                this.onShot(this.findPlayerByMessage(shotData), shotData);
            }
        }.bind(this));

        this.socket.on('shipDamage', function(data) {
            if(this.onShipDamage) {
                this.onShipDamage( players[data.emitter], players[data.target], data.damage);
            }
        }.bind(this));

        this.findPlayerByMessage = function(message) {
            return players[message.player];
        };
        this.onConnected = null;
        this.positionFrequency = 30;
        this.lastPositionSend = 1000;
    };
    NetworkEngine.prototype.spaceship = null;
    NetworkEngine.prototype.chatMessageListeners = [];
    NetworkEngine.prototype.onNewPlayer = null;
    NetworkEngine.prototype.onByePlayer  = null;
    NetworkEngine.prototype.onPlayerSpawn = null;
    NetworkEngine.prototype.onPosition = null;
    NetworkEngine.prototype.onShot = null;
    NetworkEngine.prototype.onShipDamage = null;
    NetworkEngine.prototype.onShipDie = null;

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
        this.socket.emit('spawn', spaceship.modelProperties);
        this.sendPosition();
    };
    NetworkEngine.prototype.die = function() {
        this.sendPosition();
        this.socket.emit('die', {});
        this.spaceship = null;
    };

    NetworkEngine.prototype.sufferDamage = function(playerId, damage) {
        this.socket.emit('shipDamage', {
            player: playerId,
            damage: damage
        });
    };

    NetworkEngine.prototype.sendDie = function() {
        this.socket.emit('die', {});
    };

    NetworkEngine.prototype.update = function(Core, delta) {
        this.lastPositionSend += delta;
        if(this.lastPositionSend > 1/this.positionFrequency) {
            this.lastPositionSend = 0;
            this.sendPosition();
        }
    };

    return NetworkEngine;
});
