define(['three', './input', './assetsLoader'], function(THREE, input, assetsLoader) {
    'use strict';
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    var resize = function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', resize, false);

    var timer = new THREE.Clock();

    return {
        assetsLoader: new assetsLoader(),
        start: function(callback) {
            var that = this;
            this.assetsLoader.loadMeshes(function(){
                var render = function() {
                    var  delta = timer.getDelta();
                    renderer.render(scene, camera);
                    var listeners = that.frameListeners;
                    for(var i=0;i< listeners.length; ++i) {
                        listeners[i](that, delta);
                    }
                    input.reset();
                    requestAnimationFrame(render);
                };
                document.body.appendChild(renderer.domElement);
                input.setup(renderer.domElement);

                callback();
                render();
            });
        },
        camera: camera,
        scene: scene,
        renderer: renderer,
        frameListeners: [],
        input: input
    }
});
