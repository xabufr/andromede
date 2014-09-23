define(['three'], function(THREE) {
    'use strict';
    return function Weapon(parent) {
        var loader = new THREE.JSONLoader();
        var mesh;
        var loadedCallback = function(geometry) {
            mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 'white'}));
            parent.add(mesh);
        };
        loader.load('assets/models/weapon.js', loadedCallback);
        this.tirer = function() {

        };
        this.mesh = mesh;
    };
});
