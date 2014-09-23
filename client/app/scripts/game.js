define(['three'], function(THREE) {
    'use strict';
    return {
        start: function() {
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setClearColor(0x000000, 1.0);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.shadowMapEnabled = true;

            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(20, 20, 10);

            this.sunLight = new THREE.PointLight(0x000000, 1.0, 500);
            this.sunLight.position.set(30, 30, 10);
            this.sunLight.shadowCameraFar = 10;
            this.sunLight.shadowCameraNear = 500;

            this.scene.add(this.sunLight);

            this.loader = new THREE.JSONLoader();

            this.loader.load("/ressources/models/testMonkey.js", function(geometry, material){
                this.monckeyMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial(material));
                this.scene.add(this.monckeyMesh);
            });

            this.render();
        },
        render: function(){
            requestAnimationFrame(render);

            this.renderer.autoClear = false;
            this.renderer.clear();

            this.renderer.render(this.scene, this.camera);
        }
    }
});
