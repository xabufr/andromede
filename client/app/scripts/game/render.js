define(['three'], function(THREE) {
    'use strict';
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    var render = function() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };

    return {
        start: function() {
            document.body.appendChild(renderer.domElement);
            render();
        },
        camera: camera,
        scene: scene,
        renderer: renderer,
    }
});
