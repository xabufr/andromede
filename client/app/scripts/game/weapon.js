define(['three', './laser/lasershot', 'Howler'], function(THREE, LaserShot, Howler) {
    'use strict';
    return function Weapon(parent, core, laserPool) {
        var that = this;
        this.mesh = new THREE.Mesh(core.assetsLoader.get('weapon').geometry, new THREE.MeshBasicMaterial({color: 'white'}));
        this.mesh.name = "coucou";
        parent.add(this.mesh);
        this.tirer = function() {
            var laser = laserPool.get();
            laser.init(that, 2, 0.5);
            var sound = new Howler.Howl({urls: ['assets/sound/laser.mp3']});
            sound.play();
        };
        this.isFiring = false;
    };
});
