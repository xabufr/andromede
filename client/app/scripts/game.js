define(['game/render', 'game/spacebox', 'game/weapon', 'game/laser/lasershot', 'core/pool'], function(render, spacebox, Weapon, laser, Pool) {
    'use strict';
    return {
        start: function() {
            var that = this;
            render.start(function(){
                var first = 0;
                var weapon = new Weapon(render.scene, render, that.laserPool);
                weapon.mesh.position.x = 6;
                render.frameListeners.push(function() {
                    if(first === 0) {
                        var weapon2 = new Weapon(render.scene, render, that.laserPool);
                        weapon2.mesh.position.set(0, 10,0);
                        var weapon2 = new Weapon(render.scene, render, that.laserPool);
                        weapon2.mesh.position.set(10, 0,0);
                    } else if(first === 1) {
                        weapon.tirer();
                    }
                    ++first;
                });
                render.scene.add(spacebox);

                render.camera.position.set(0, 0, 10);
                render.camera.lookAt(new THREE.Vector3(0, 0, 0));

            });
        },
        laserPool: new Pool(laser, 50, render)
    }
});
