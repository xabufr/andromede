define(['three', 'game/spacebox', 'game/spaceShip'], function(THREE, spacebox, spaceShip) {
    'use strict';
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    scene.add(spacebox);
    spaceShip.init(scene);

    var render = function() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };

    return {
        start: function() {
            document.body.appendChild(renderer.domElement);
            camera.position.set(0, 0, 10);
            var sunLight = new THREE.PointLight(0xffffff, 1.0, 50);
            sunLight.position.set(20, 20, 5);
            sunLight.shadowCameraFar = 10;
            sunLight.shadowCameraNear = 50;

            scene.add(sunLight);

            render();
        }
    }
});
