define(['game/render', 'game/spacebox', 'game/weapon', 'game/lasershot'], function(render, spacebox, Weapon, laser) {
    'use strict';
    render.scene.add(spacebox);

    render.camera.position.set(0, 0, 2);
    render.camera.lookAt(new THREE.Vector3(0, 0, 0));



    var weapon = new Weapon(render.scene);
    var testLaser = new laser(weapon, render.scene, 1000);

    return {
        start: function() {
            render.start();
        }
    }
});
