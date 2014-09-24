define(['game/render', 'game/camera', 'game/cursor', 'game/spacebox', 'game/spaceShip', 'game/weapon', 'game/laser/lasershot', 'core/pool'], function(render, camera, Cursor, spacebox, SpaceShip,Weapon, laser, Pool) {
    'use strict';
    return {
        start: function() {
            render.camera = new camera(null, 10);
            var that = this;
            render.start(function(){
                var weapon = new Weapon(render.scene, render, that.laserPool);
                weapon.mesh.position.x = 6;
                var weapon2 = new Weapon(render.scene, render, that.laserPool);
                weapon2.mesh.position.set(0, 10,0);
                var weapon2 = new Weapon(render.scene, render, that.laserPool);
                weapon2.mesh.position.set(10, 0,0);
                var timeSinceLastFire = 1000;
                render.frameListeners.push(function(_, delta) {
                    if(render.input.mouse.buttons.left && timeSinceLastFire > 1) {
                        timeSinceLastFire = 0;
                        weapon.tirer();
                    }
                    timeSinceLastFire+= delta;
                });
                render.scene.add(spacebox);

                var sunLight = new THREE.PointLight(0xffffff, 1.0, 50);
                sunLight.position.set(20, 20, 0);
                sunLight.shadowCameraFar = 10;
                sunLight.shadowCameraNear = 50;

                render.scene.add(sunLight);

                var spaceShip = new SpaceShip(render);
                render.camera.setTarget(spaceShip.mesh);

                var cursor = new Cursor(render.scene);

                render.frameListeners.push(spaceShip.move);
                render.frameListeners.push(cursor.move);
            });
        },
        laserPool: new Pool(laser, 50, render)
    }
});
