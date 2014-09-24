define(['game/render', 'game/camera','game/spacebox', 'game/spaceShip'], function(render, camera, spacebox, SpaceShip) {
    'use strict';
    return {
        start: function() {
            render.camera = new camera(null, 10);

            render.start(function(){
                render.scene.add(spacebox);

                var sunLight = new THREE.PointLight(0xffffff, 1.0, 50);
                sunLight.position.set(20, 20, 0);
                sunLight.shadowCameraFar = 10;
                sunLight.shadowCameraNear = 50;

                render.scene.add(sunLight);

                var spaceShip = new SpaceShip(render);
                render.camera.setTarget(spaceShip.mesh);

                render.frameListeners.push(spaceShip.move);
            });
        }
    }
});
