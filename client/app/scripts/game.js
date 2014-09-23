define(['game/render', 'game/spacebox', 'game/spaceShip'], function(render, spacebox, spaceShip) {
    'use strict';
    render.scene.add(spacebox);

    render.camera.position.set(0, 0, 10);
    render.camera.lookAt(new THREE.Vector3(0, 0, 0));
    var sunLight = new THREE.PointLight(0xffffff, 1.0, 50);
    sunLight.position.set(20, 20, 5);
    sunLight.shadowCameraFar = 10;
    sunLight.shadowCameraNear = 50;

    render.scene.add(sunLight);

    spaceShip.init(render.scene);

    return {
        start: function() {
            render.start();
        }
    }
});
