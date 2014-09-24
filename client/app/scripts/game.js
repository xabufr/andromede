define(['game/render', 'game/spacebox', 'game/weapon', 'game/laser/lasershot', 'core/pool'], function(render, spacebox, Weapon, laser, Pool) {
    'use strict';
    return {
        start: function() {
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

                render.camera.position.set(0, 0, 10);
                render.camera.lookAt(new THREE.Vector3(0, 0, 0));

            });
        },
        laserPool: new Pool(laser, 50, render)
    }
});
