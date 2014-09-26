define(['core/core', 'network', 'game/camera', 'game/cursor', 'game/spacebox', 'game/spaceShip', 'game/weapon', 'game/laser/lasershot', 'core/pool'], function(Core, NetworkEngine, Camera, Cursor, Spacebox, SpaceShip,Weapon, laser, Pool) {
    'use strict';
    return {
        start: function() {
            Core.camera = new Camera(null, 10);
            Core.frameListeners.push(Core.camera.update);
            Core.start(function(){
                var network = new NetworkEngine(this);

                var spacebox = new Spacebox(Core);

                var weapon = new Weapon(Core.objectsNode, Core, this.laserPool);
                weapon.mesh.position.x = 6;
                weapon.network = network;
                var weapon2 = new Weapon(Core.objectsNode, Core, this.laserPool);
                weapon2.mesh.position.set(0, 10,0);
                var weapon2 = new Weapon(Core.objectsNode, Core, this.laserPool);
                weapon2.mesh.position.set(10, 0,0);
                var spaceShip = new SpaceShip(Core);
                spaceShip.network = network;
                Core.frameListeners.push(function(_, delta) {
                    weapon.isFiring = Core.input.mouse.buttons.left;
                    weapon.update(_, delta);
                    network.sendPosition(spaceShip);
                });

                var sunLight = new THREE.PointLight(0xffffff, 1.0, 50);
                sunLight.position.set(20, 20, 0);
                sunLight.shadowCameraFar = 10;
                sunLight.shadowCameraNear = 50;

                Core.scene.add(sunLight);

                Core.camera.setTarget(spaceShip.mesh);

                Core.cursor = new Cursor(Core.scene);

                Core.frameListeners.push(spaceShip.move);
                Core.frameListeners.push(Core.cursor.move);
            }.bind(this));
        },
        laserPool: new Pool(laser, 5, Core)
    }
});
