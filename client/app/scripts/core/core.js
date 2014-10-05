define(['three', './../game/input', './assetsLoader', './assertsLoaderReporter', 'Stats'], function(THREE, input, AssetsLoader, AssetsLoaderReporter, Stats) {
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
    scene.add(effetsNode);
    scene.add(objectsNode);
    var ambient = new THREE.AmbientLight( 0xffffff );
    ambient.color.setHSL( 0.1, 0.3, 0.2 );
    scene.add( ambient );
    var renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    var timer = new THREE.Clock();
    var loader = new AssetsLoader();
    var reporter = new AssetsLoaderReporter(loader);
    var beforeRenderListeners = [];
    var frameListeners = [];
    var corePublic = {
        assetsLoader: loader,
        start: function(callback) {
            reporter.onCompleteCallback = makeBootstrapFunction(callback);
            reporter.start();
        },
        camera: null,
        scene: scene,
        cursor: null,
        sceneFirstPass: sceneFirstPass,
        renderer: renderer,
        frameListeners: frameListeners,
        beforeRenderListeners: beforeRenderListeners,
        input: input,
        objectsNode: objectsNode,
        effectsNode: effetsNode
    };
    function makeBootstrapFunction(callback) {
        return function () {
            var render = function() {
                stats.begin();
                for(var i=0;i<beforeRenderListeners.length;++i) {
                    beforeRenderListeners[i](corePublic);
                }
                var  delta = timer.getDelta();
                renderer.clear();
                renderer.render(sceneFirstPass, corePublic.camera.threeCamera);
                renderer.render(scene, corePublic.camera.threeCamera);

                for(var i=0;i< frameListeners.length; ++i) {
                    frameListeners[i](corePublic, delta);
                }

                input.reset();
                stats.end();
                requestAnimationFrame(render);
            };

            var resize = function() {
                corePublic.camera.threeCamera.aspect = window.innerWidth / window.innerHeight;
                corePublic.camera.threeCamera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            };

            window.addEventListener('resize', resize, false);

            document.body.appendChild(renderer.domElement);
            document.body.appendChild(stats.domElement);
            input.setup(renderer.domElement);

            callback();
            render();
        }
    }
    return corePublic;
});
