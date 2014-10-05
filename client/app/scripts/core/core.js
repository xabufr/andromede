define(['three', './../game/input', './assetsLoader', './assertsLoaderReporter', 'Stats'], function(THREE, input, AssetsLoader, AssetsLoaderReporter, Stats) {
    'use strict';
    var scene = new THREE.Scene(),
        sceneFirstPass = new THREE.Scene(),
        objectsNode = new THREE.Object3D(),
        effetsNode = new THREE.Object3D(),
        stats = new Stats(),
        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        }),
        timer = new THREE.Clock(),
        loader = new AssetsLoader(),
        reporter = new AssetsLoaderReporter(loader),
        beforeRenderListeners = [],
        frameListeners = [];

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

    return corePublic;

    function initThree() {
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.left = '0px';
        scene.add(effetsNode);
        scene.add(objectsNode);
        renderer.autoClear = false;
        renderer.setClearColor(0x000000, 1.0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
    }

    function makeBootstrapFunction(callback) {
        return function () {
            initThree();
            window.addEventListener('resize', resize, false);

            document.body.appendChild(renderer.domElement);
            document.body.appendChild(stats.domElement);
            input.setup(renderer.domElement);

            callback();
            render();
        }
    }

    function render() {
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
    }

    function resize() {
        corePublic.camera.threeCamera.aspect = window.innerWidth / window.innerHeight;
        corePublic.camera.threeCamera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});
