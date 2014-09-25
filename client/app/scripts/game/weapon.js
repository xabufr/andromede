define(['three', './laser/lasershot', 'Howler'], function(THREE, LaserShot, Howler) {
    'use strict';
    var count = 0;
    return function Weapon(parent, core, laserPool) {
        var lastFire = 0;
        this.mesh = new THREE.Mesh(core.assetsLoader.get('weapon').geometry, new THREE.MeshBasicMaterial({color: 'white'}));
        this.mesh.name = 'weapon'+count++;
        this.imprecision = Math.PI / 16;
        parent.add(this.mesh);
        this.tirer = function() {
            lastFire = 0;
            var laser = laserPool.get();
            laser.init(this, 2000, 0.5);
            var sound = new Howler.Howl({urls: ['assets/sound/laser.mp3']});
            sound.play();
        }.bind(this);
        this.update = function(_, delta) {
            if(this.isFiring && lastFire >= 0.001) {
                this.tirer();
            }
            lastFire += delta;
        };
        this.isFiring = false;
    };
});
