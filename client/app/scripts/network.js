define(['SocketIO'], function(io) {
    function NetworkEngine(Game, _parameters) {
        var parameters = _parameters || {};
        this.socket = new io();
        this.socket.emit('new player', {
            name: parameters.playerName || 'Default player'
        });
        this.socket.on('ping', function(data) {
              this.socket.emit('pong', data);
        }.bind(this));
    };

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

    return NetworkEngine;
});
