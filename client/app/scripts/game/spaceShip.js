define(['three'], function(THREE) {
    'use strict';
    var loader = new THREE.JSONLoader();
    var mesh = null;

    return {
        init: function(scene){
            loader.load("assets/models/spaceShip.js", function(geometry, materials){
                mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial(materials));
                mesh.receiveShadow = true;
                mesh.position.set(0,0,0);

                scene.add(mesh);
            });
        }
    }
});
