define(['three', './laser/lasershot', 'Howler'], function(THREE, LaserShot, Howler) {
    'use strict';
    var count = 1;
    return function Weapon(core, laserPool) {
        var lastFire = 0;
        this.mesh = new THREE.SkinnedMesh(core.assetsLoader.get('mainWeapon').geometry,
            new THREE.MeshFaceMaterial(core.assetsLoader.get('mainWeapon').materials));
        this.mesh.name = 'mainWeapon'+count++;
        this.imprecision = Math.PI / 16;
        this.tirer = function() {
            lastFire = 0;
            var laser = laserPool.get();
            laser.init(this, 2000, 0.5);
            var sound = new Howler.Howl({urls: ['assets/sound/laser.mp3']});
            sound.play();
            if(this.network !== null) {
                this.network.sendShot(laser.serialize());
            }
        }.bind(this);
        this.update = function(_, delta) {
            if(this.isFiring && lastFire >= 0.1) {
                this.tirer();
            }
            lastFire += delta;
        };
        this.isFiring = false;
        this.network = null;
    };
});
