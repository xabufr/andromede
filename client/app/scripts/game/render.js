define(['three', './input', './assetsLoader'], function(THREE, input, assetsLoader) {
    'use strict';
    var scene = new THREE.Scene();
    var sceneFirstPass = new THREE.Scene();
    var objectsNode = new THREE.Object3D();
    var effetsNode = new THREE.Object3D();
    scene.add(objectsNode);
    scene.add(effetsNode);
    var renderer = new THREE.WebGLRenderer();
    renderer.autoClear = false;
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
            this.assetsLoader.loadMeshes(function(){
                var render = function() {
                    for(var i=0;i<this.beforeRenderListeners.length;++i) {
                        this.beforeRenderListeners[i](this);
                    }
                    var  delta = timer.getDelta();
                    renderer.clear();
                    renderer.render(sceneFirstPass, this.camera.threeCamera);
                    renderer.render(this.scene, this.camera.threeCamera);

                    var listeners = this.frameListeners;

                    for(var i=0;i< listeners.length; ++i) {
                        listeners[i](this, delta);
                    }

                    input.reset();
                    requestAnimationFrame(render);
                }.bind(this);
                document.body.appendChild(renderer.domElement);
                input.setup(renderer.domElement);

                callback();
                render();
            }.bind(this));
        },
        camera: null,
        scene: scene,
        sceneFirstPass: sceneFirstPass,
        renderer: renderer,
        frameListeners: [],
        beforeRenderListeners: [],
        input: input,
        objectsNode: objectsNode,
        effectsNode: effetsNode
    }
});
