define(['three', './input', './assetsLoader'], function(THREE, input, assetsLoader) {
    'use strict';
    var scene = new THREE.Scene();
    var objectsNode = new THREE.Object3D();
    var effetsNode = new THREE.Object3D();
    scene.add(objectsNode);
    scene.add(effetsNode);
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    var resize = function() {
        renderer.camera.threeCamera.aspect = window.innerWidth / window.innerHeight;
        renderer.camera.threeCamera.updateProjectionMatrix();
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
                    renderer.render(that.scene, that.camera.threeCamera);

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
        camera: null,
        scene: scene,
        renderer: renderer,
        frameListeners: [],
        input: input,
        objectsNode: objectsNode,
        effectsNode: effetsNode
    }
});
