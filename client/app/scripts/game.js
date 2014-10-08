define(['core/core', 'network', 'game/camera', 'game/cursor', 'game/spacebox', 'game/spaceShip', 'game/weapon', 'game/laser/lasershot',
        'core/pool', './game/ui/uiMain', './game/spaceShipControl', 'TWEEN', 'game/sun'],
    function(Core, NetworkEngine, Camera, Cursor, Spacebox, SpaceShip, Weapon, laser, Pool, UI, SpaceShipControl, TWEEN, Sun) {
        'use strict';
        var Game = {};
        var players = {};
        var network = new NetworkEngine(this);
        var localId = null;
        var localSpaceship = null;
        var control = null;
        function localshipDie() {
            network.die();
            localSpaceship.die();
            spawnLocalSpaceship();
        }
        var frameListener = function (Core, delta) {
            TWEEN.update(delta * 0.001);
            control.update(Core, delta);
            var hits = localSpaceship.update(Core, delta);
            if (hits.length > 0) {
                var ships = {};
                for (var i = 0; i < hits.length; ++i) {
                    var hit = hits[i];
                    if (hit.mesh.userData && hit.mesh.userData.type === 'spaceship') {
                        var player = hit.mesh.userData.object.player;
                        var damage = hit.weapon.damage;
                        if (!ships[player.id]) {
                            ships[player.id] = damage;
                        } else {
                            ships[player.id] += damage;
                        }
                    }
                }
                var playersId = Object.keys(ships);
                for (var i = 0; i < playersId.length; ++i) {
                    network.sufferDamage(playersId[i], ships[playersId[i]]);
                }
            }
            network.update(Core, delta);
            Core.cursor.move(Core, delta);
            var keys = Object.keys(players);
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                if (key === localId) {
                    continue;
                }
                if (players[key].ship) {
                    players[key].ship.update(Core, delta);
                }
            }
        };
        function spawnLocalSpaceship () {
            localSpaceship = new SpaceShip(Core);
            localSpaceship.onDie = localshipDie;
            players[localId].ship = localSpaceship;

            control = new SpaceShipControl(localSpaceship);
            var weapon = new Weapon(Core, Game.laserPool);
            weapon.mesh.name = 'mainWeapon1';
            localSpaceship.setWeapon(weapon);
            weapon = new Weapon(Core, Game.laserPool);
            weapon.mesh.name = 'mainWeapon2';
            localSpaceship.setWeapon(weapon);
            localSpaceship.network = network;
            network.spawn(localSpaceship);
            Core.camera.setTarget(localSpaceship.mesh);
        }
        var startGame = function() {
            var sun = new Sun({x: 100, y:200, z: 500}, 700, new THREE.Color('yellow'), Core);
            var ui = new UI(Core, network);
            var spacebox = new Spacebox(Core);

            spawnLocalSpaceship();

            Core.cursor = new Cursor(Core.scene);

            Core.frameListeners.push(frameListener);
        }.bind(Game);
        var initNetwork = function() {
            this.laserPool = new Pool(laser, 5, Core);
            network = new NetworkEngine();
            Core.camera = new Camera(null, 10);
            Core.frameListeners.push(Core.camera.update);
            network.onNewPlayer = function(player) {
                players[player.id] = {
                    id:player.id
                };
            };
            network.onPlayerSpawn = function(player, shipModel) {
                var spaceship = players[player.id].ship = new SpaceShip(Core);
                var weapon = new Weapon(Core, this.laserPool);
                weapon.mesh.name = 'mainWeapon1';
                spaceship.setWeapon(weapon);
                weapon = new Weapon(Core, this.laserPool);
                weapon.mesh.name = 'mainWeapon2';
                spaceship.setWeapon(weapon);
                spaceship.player = players[player.id];
            }.bind(this);

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
            network.onShot = function(player, shotData) {
                var spaceship = players[player.id].ship;
                if(spaceship) {
                    spaceship.shotFromData(shotData);
                }
            };
            network.onShipDamage = function(emitter, target, damage) {
                var spaceship = players[target.id].ship;
                if(spaceship) {
                    spaceship.sufferDamages(damage);
                }
            };
            network.onConnected = function(id) {
                localId = id;
                players[id] = {
                    id: id
                };
                startGame();
            };
            network.onShipDie = function(player) {
                players[player.id].ship.die();
                delete players[player.id].ship;
            };
        }.bind(Game);
        return {
            start: function() {
                Core.start(initNetwork);
            }
        }
    });
