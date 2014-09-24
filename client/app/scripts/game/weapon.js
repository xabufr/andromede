define(['three', './laser/lasershot', 'Howler'], function(THREE, LaserShot, Howler) {
    'use strict';
    var count = 0;
    return function Weapon(parent, core, laserPool) {
        var that = this;
        var lastFire = 0;
        this.mesh = new THREE.Mesh(core.assetsLoader.get('weapon').geometry, new THREE.MeshBasicMaterial({color: 'white'}));
        this.mesh.name = 'weapon'+count++;
        this.imprecision = Math.PI / 16;
        parent.add(this.mesh);
        this.tirer = function() {
            lastFire = 0;
            var laser = laserPool.get();
            laser.init(that, 2000, 0.5);
            var sound = new Howler.Howl({urls: ['assets/sound/laser.mp3']});
            sound.play();
        };
        this.update = function(_, delta) {
            if(this.isFiring && lastFire >= 0.1) {
                this.tirer();
            }
            lastFire += delta;
        };
        this.isFiring = false;
    };
});
