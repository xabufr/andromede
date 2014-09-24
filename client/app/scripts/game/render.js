define(['three', './input', './assetsLoader'], function(THREE, input, assetsLoader) {
    'use strict';
    var scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    return {
        assetsLoader: new assetsLoader(),
        start: function(callback) {
            var that = this;
            this.assetsLoader.loadMeshes(function(){
                var render = function() {
                    renderer.render(that.scene, that.camera.threeCamera);
                    var listeners = that.frameListeners;

                    for(var i=0;i< listeners.length; ++i) {
                        listeners[i](that);
                    }

                    if (that.input.mouse.move) {
                        that.input.mouse.move = false;
                        that.input.mouse.rel = {x:0,y:0};
                    }

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
        input: input
    }
});
