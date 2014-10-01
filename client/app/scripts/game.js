define(['core/core', 'network', 'game/camera', 'game/cursor', 'game/spacebox', 'game/spaceShip', 'game/weapon', 'game/laser/lasershot', 'core/pool', './game/ui/uiMain', './game/spaceShipControl'], function(Core, NetworkEngine, Camera, Cursor, Spacebox, SpaceShip,Weapon, laser, Pool, UI, SpaceShipControl) {
    'use strict';
    return {
        start: function() {
            Core.camera = new Camera(null, 10);
            Core.frameListeners.push(Core.camera.update);
            Core.start(function(){
                var players = {};
                var network = new NetworkEngine(this);
                network.onNewPlayer = function(player) {
                    players[player.id] = {};
                };
                network.onPlayerSpawn = function(player, spawn) {
                    players[player.id].ship = new SpaceShip(Core);
                };
                network.onPosition = function(player, positionData) {
                    if(players[player.id].ship) {
                        players[player.id].ship.deserialize(positionData);
                    }
                };
                network.onByePlayer = function(player) {
                    var spaceship = players[player.id].ship;
                    if(spaceship) {
                        spaceship.remove();
                    }
                };

                var ui = new UI(Core, network);

                var spacebox = new Spacebox(Core);

                var sunLight = new THREE.PointLight(0xffffff, 5.0, 50);
                sunLight.position.set(10, 10, 0);
                sunLight.shadowCameraFar = 10;
                sunLight.shadowCameraNear = 50;

                Core.scene.add(sunLight);

                var spaceShip = new SpaceShip(Core);
                var control = new SpaceShipControl(spaceShip);
                spaceShip.setWeapon(new Weapon(Core, this.laserPool));
                spaceShip.setWeapon(new Weapon(Core, this.laserPool));
                network.spawn(spaceShip);

                Core.camera.setTarget(spaceShip.mesh);

                Core.cursor = new Cursor(Core.scene);

                Core.frameListeners.push(function(Core, delta) {
                    control.update(Core, delta);
                    spaceShip.update(Core, delta);
                    network.update(Core, delta);
                    Core.cursor.move(Core, delta);
                    var keys = Object.keys(players);
                    for(var i=0;i<keys.length;++i) {
                        var key = keys[i];
                        if(players[key].ship) {
                            players[key].ship.update(Core, delta);
                        }
                    }
                }.bind(this));
            }.bind(this));
        },
        laserPool: new Pool(laser, 5, Core)
    }
});
