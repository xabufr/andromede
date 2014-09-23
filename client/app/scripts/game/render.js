define(['three', './input'], function(THREE, input) {
    'use strict';
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    return {
        start: function() {
            var that = this;
            var render = function() {
                renderer.render(scene, camera);
                var listeners = that.frameListeners;
                for(var i=0;i< listeners.length; ++i) {
                    listeners[i](that);
                }
                requestAnimationFrame(render);
            };
            document.body.appendChild(renderer.domElement);
            input.setup(renderer.domElement);
            render();
        },
        camera: camera,
        scene: scene,
        renderer: renderer,
        frameListeners: [],
        input: input
    }
});
