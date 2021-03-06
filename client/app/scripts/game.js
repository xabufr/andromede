define(['core/core', 'network', 'game/camera', 'game/ui/cursor', 'game/spacebox', 'game/spaceShip', 'game/weapon', 'game/laser/lasershot',
        'core/pool', './game/ui/uiMain', './game/spaceShipControl', 'TWEEN', 'game/sun', 'game/posteffects/glitch', './game/ui/spaceshipinfos'],
    function(Core, NetworkEngine, Camera, Cursor, Spacebox, SpaceShip, Weapon, laser, Pool, UI, SpaceShipControl, TWEEN, Sun, GlitchPass, SpaceshipInfos) {
        "use strict";
        var Game = {};
        var players = {};
        var network = new NetworkEngine(this);
        var localId = null;
        var localSpaceship = null;
        var control = null;
        var glitchPass = new GlitchPass();
        var ui = null;
        function localshipDie() {
            network.die();
            localSpaceship.die();
            spawnLocalSpaceship();
        }
        function onLocalshipDamage(ship, damageAmount) {
            glitchPass.glitchDuring((damageAmount * 0.75) | 0);
        }

        function sendLocalPlayerHits(Core, delta) {
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
        }

        var frameListener = function (Core, delta) {
            TWEEN.update(delta * 0.001);
            control.update(Core, delta);
            sendLocalPlayerHits(Core, delta);
            ui.update(Core, delta, localSpaceship);
            network.update(Core, delta);
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

            control = new SpaceShipControl(localSpaceship, Game);
            var weapon = new Weapon(Core, Game.laserPool);
            weapon.mesh.name = 'mainWeapon1';
            localSpaceship.setWeapon(weapon);
            weapon = new Weapon(Core, Game.laserPool);
            weapon.mesh.name = 'mainWeapon2';
            localSpaceship.setWeapon(weapon);
            localSpaceship.network = network;
            localSpaceship.onDamage = onLocalshipDamage;
            network.spawn(localSpaceship);
            Core.camera.setTarget(localSpaceship.mesh);
        }
        var startGame = function() {
            var sun = new Sun({x: 100, y:200, z: 500}, 700, new THREE.Color('yellow'), Core);
            ui = new UI(Core, network);
            Game.ui = ui;
            var spacebox = new Spacebox(Core);

            spawnLocalSpaceship();

            Core.composer.addPass(glitchPass);
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
                var playerData = players[player.id];
                var spaceship = playerData.ship = new SpaceShip(Core);
                var weapon = new Weapon(Core, this.laserPool);
                weapon.mesh.name = 'mainWeapon1';
                spaceship.setWeapon(weapon);
                weapon = new Weapon(Core, this.laserPool);
                weapon.mesh.name = 'mainWeapon2';
                spaceship.setWeapon(weapon);
                spaceship.player = playerData;
                var spaceshipInfos = new SpaceshipInfos(spaceship);
                playerData.shipInfos = ui.createScreenTracker(spaceship.mesh, spaceshipInfos);
            }.bind(this);

            network.onPosition = function(player, positionData) {
                if(players[player.id].ship) {
                    players[player.id].ship.deserialize(positionData);
                }
            };
            network.onByePlayer = function(player) {
                var playerData = players[player.id];
                var spaceship = playerData.ship;
                if(spaceship) {
                    spaceship.remove();
                    ui.deleteScreenTracker(playerData.shipInfos);
                }
                delete players[player.id];
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
                var playerData = players[player.id];
                playerData.ship.die();
                ui.deleteScreenTracker(playerData.shipInfos);
                delete players[player.id].ship;
            };
        }.bind(Game);
        return {
            start: function() {
                Core.start(initNetwork);
            }
        }
    });
