define(['three'], function(THREE) {
    'use strict';
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    var loader = new THREE.JSONLoader();
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    var render = function() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };

    return {
        start: function() {
            var sunLight = new THREE.PointLight(0xffffff, 1.0, 500);
            sunLight.position.set(30, 30, 10);
            sunLight.shadowCameraFar = 10;
            sunLight.shadowCameraNear = 500;

            scene.add(sunLight);


            loader.load("/ressources/models/testMonkey.js", function(geometry, material){
                var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial(material));
                scene.add(mesh);
            });
        },
        render: function(){
            document.body.appendChild(renderer.domElement);
            render();
        }
    }
});
