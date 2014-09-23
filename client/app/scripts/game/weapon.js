define(['three'], function(THREE) {
    'use strict';
    return function Weapon(parent, core) {
        this.mesh = new THREE.Mesh(core.assetsLoader.get('weapon').geometry, new THREE.MeshBasicMaterial({color: 'white'}));
        this.mesh.name = "coucou";
        parent.add(this.mesh);
        this.tirer = function() {

        };
    };
});
