define(['three', './input', './assetsLoader', 'Stats'], function(THREE, input, assetsLoader, Stats) {
    'use strict';
    var scene = new THREE.Scene();
    var sceneFirstPass = new THREE.Scene();
    var objectsNode = new THREE.Object3D();
    var effetsNode = new THREE.Object3D();
    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.left = '0px';
    scene.add(objectsNode);
    scene.add(effetsNode);
    var renderer = new THREE.WebGLRenderer();
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    var timer = new THREE.Clock();

    return {
        assetsLoader: new assetsLoader(),
        start: function(callback) {
            this.assetsLoader.loadMeshes(function(){
                var render = function() {
                    stats.begin();
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
                    stats.end();
                    requestAnimationFrame(render);
                }.bind(this);

                var resize = function() {
                    this.camera.threeCamera.aspect = window.innerWidth / window.innerHeight;
                    this.camera.threeCamera.updateProjectionMatrix();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                }.bind(this);

                window.addEventListener('resize', resize, false);

                document.body.appendChild(renderer.domElement);
                document.body.appendChild(stats.domElement);
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
