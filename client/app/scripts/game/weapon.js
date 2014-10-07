define(['three', './laser/lasershot', 'Howler'], function(THREE, LaserShot, Howler) {
    'use strict';
    var count = 1;
    var tmpMatrix = new THREE.Matrix4();
    var tmpMatrixRotation = new THREE.Matrix4();
    return function Weapon(core, laserPool) {
        var lastFire = 0;
        this.particleGroup = new SPE.Group({
            texture: THREE.ImageUtils.loadTexture('assets/textures/smokeparticle.png'),
            maxAge: 0.5
        });
        this.particleEmitter = new SPE.Emitter({
            type: 'cube',
            position: new THREE.Vector3(0,0,0),
            acceleration: new THREE.Vector3(-4, 0, 0),
            velocity: new THREE.Vector3(3.5, 0, 0),
            velocitySpread: new THREE.Vector3(2,2,2),
            particlesPerSecond: 750,
            sizeStart: 0.15,
            sizeStartSpread: 0.05,
            sizeEnd: 1,
            opacityStart: 1,
            angleStartSpread: Math.PI,
            opacityEnd: 0,
            colorStart: new THREE.Color('white'),
            colorEnd: new THREE.Color('blue'),
            emitterDuration: 0.05,
            alive: 0
        });
        var lifeTime = 0.2;
        var currentLifeTime = lifeTime;

        this.particleGroup.addEmitter(this.particleEmitter);
        this.mesh = new THREE.SkinnedMesh(core.assetsLoader.get('mainWeapon').geometry,
            new THREE.MeshFaceMaterial(core.assetsLoader.get('mainWeapon').materials));
        this.mesh.name = 'mainWeapon'+count++;

        core.effectsNode.add(this.particleGroup.mesh);
        this.imprecision = Math.PI / 16;
        this.tirer = function() {
            lastFire = 0;
            currentLifeTime = 0;
            var laser = laserPool.get();
            laser.init(this, 2000, 0.5);
            var sound = new Howler.Howl({urls: ['assets/sound/laser.mp3']});
            sound.play();
            if(this.network !== null) {
                this.network.sendShot(laser.serialize());
            }
        }.bind(this);
        this.update = function(_, delta) {
            this.particleGroup.tick(delta);

            currentLifeTime += delta;
            if (currentLifeTime > lifeTime) {
                currentLifeTime = lifeTime;
            }

            this.particleEmitter.alive = (lifeTime - currentLifeTime) / lifeTime;


            for (var i=0; i < this.mesh.skeleton.bones.length; i++) {
                var bone = this.mesh.skeleton.bones[i];
                if (bone.name === 'fire') {
                    tmpMatrix.copy(bone.matrixWorld);
                    tmpMatrixRotation.makeRotationY(Math.PI * 0.5);
                    tmpMatrix.multiply(tmpMatrixRotation);
                    this.particleGroup.mesh.position.setFromMatrixPosition(bone.matrixWorld);
                    this.particleGroup.mesh.rotation.setFromRotationMatrix(tmpMatrix);
                }
            }

            if(this.isFiring && lastFire >= 0.1) {
                this.tirer();
            }
            lastFire += delta;
        };
        this.isFiring = false;
        this.network = null;
    };
});
