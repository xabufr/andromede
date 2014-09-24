define(['three', './laser/lasershot'], function(THREE, LaserShot) {
    'use strict';
    return function Weapon(parent, core, laserPool) {
        var that = this;
        this.mesh = new THREE.Mesh(core.assetsLoader.get('weapon').geometry, new THREE.MeshBasicMaterial({color: 'white'}));
        this.mesh.name = "coucou";
        parent.add(this.mesh);
        this.tirer = function() {
            var laser = laserPool.get();
            laser.init(that, 2, 2);
        };
    };
});
