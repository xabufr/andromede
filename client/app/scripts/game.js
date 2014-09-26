define(['core/core', 'network', 'game/camera', 'game/cursor', 'game/spacebox', 'game/spaceShip', 'game/weapon', 'game/laser/lasershot', 'core/pool'], function(Core, NetworkEngine, Camera, Cursor, Spacebox, SpaceShip,Weapon, laser, Pool) {
    'use strict';
    return {
        start: function() {
            Core.camera = new Camera(null, 10);
            Core.frameListeners.push(Core.camera.update);
            Core.start(function(){
                var network = new NetworkEngine(this);

                var spacebox = new Spacebox(Core);

                var sunLight = new THREE.PointLight(0xffffff, 5.0, 50);
                sunLight.position.set(10, 10, 0);
                sunLight.shadowCameraFar = 10;
                sunLight.shadowCameraNear = 50;

                Core.scene.add(sunLight);

                var spaceShip = new SpaceShip(Core);
                spaceShip.setWeapon(new Weapon(Core, this.laserPool));
                spaceShip.setWeapon(new Weapon(Core, this.laserPool));

                Core.camera.setTarget(spaceShip.mesh);

                Core.cursor = new Cursor(Core.scene);

                Core.frameListeners.push(spaceShip.move);
                Core.frameListeners.push(Core.cursor.move);
            }.bind(this));
        },
        laserPool: new Pool(laser, 5, Core)
    }
});
