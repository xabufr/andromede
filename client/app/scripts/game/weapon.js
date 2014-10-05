define(['three', './laser/lasershot', 'Howler'], function(THREE, LaserShot, Howler) {
    'use strict';
    var count = 1;
    return function Weapon(core, laserPool) {
        var lastFire = 0;
        this.mesh = new THREE.SkinnedMesh(core.assetsLoader.get('models', 'mainWeapon').geometry,
            new THREE.MeshFaceMaterial(core.assetsLoader.get('models', 'mainWeapon').materials));
        this.mesh.name = 'mainWeapon'+count++;
        this.imprecision = Math.PI / 64;
        this.tirer = function() {
            lastFire = 0;
            var laser = laserPool.get();
            laser.init(this, 2000, 0.5);
            var sound = new Howler.Howl({urls: ['assets/sound/laser.mp3']});
            sound.play();
            return laser;
        }.bind(this);
        this.update = function(_, delta) {
            var shot = false;
            if(this.isFiring && lastFire >= 0.1) {
                shot = this.tirer();
            }
            lastFire += delta;
            return shot;
        };
        this.shotFromData = function(shotData) {
            var laser = laserPool.get();
            laser.initFromData(this, 0.5, shotData);
        };
        this.isFiring = false;
    };
});
