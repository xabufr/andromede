define(['game/render', 'game/spacebox', 'game/weapon', 'game/lasershot'], function(render, spacebox, Weapon, laser) {
    'use strict';
    return {
        start: function() {
            render.start(function(){
                var first = 0;
                var weapon = new Weapon(render.scene, render);
                weapon.mesh.position.x = 6;
                render.frameListeners.push(function() {
                    if(first === 0) {
                        var weapon2 = new Weapon(render.scene, render);
                        weapon2.mesh.position.set(0, 10,0);
                        var weapon2 = new Weapon(render.scene, render);
                        weapon2.mesh.position.set(10, 0,0);
                    } else if(first === 1) {
                        var testLaser = new laser(weapon, render.scene, 1000);
                    }
                    ++first;
                });
                render.scene.add(spacebox);

                render.camera.position.set(0, 0, 50);
                render.camera.lookAt(new THREE.Vector3(0, 0, 0));

            });
        }
    }
});
