define(['three'], function(THREE) {
    'use strict';
    var count = 1;
    var tmpMatrix = new THREE.Matrix4();
    var tmpMatrixRotation = new THREE.Matrix4();
    function Weapon(core, laserPool) {
        var lastFire = 0;
        this.particleGroup = new SPE.Group({
            texture: core.assetsLoader.get('textures', 'smokeparticle'),
            maxAge: 0.1
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
        this.mesh = new THREE.SkinnedMesh(core.assetsLoader.get('models', 'mainWeapon').geometry,
            new THREE.MeshFaceMaterial(core.assetsLoader.get('models', 'mainWeapon').materials));
        this.mesh.name = 'mainWeapon'+count++;
        this.bones = {};

        for (var i=0; i < this.mesh.skeleton.bones.length; i++) {
            var bone = this.mesh.skeleton.bones[i];
            this.bones[bone.name] = bone;
        }

        core.effectsNode.add(this.particleGroup.mesh);
        this.imprecision = Math.PI / 64;
        this.damage = 25 | 0;
        this.tirer = function() {
            lastFire = 0;
            currentLifeTime = 0;
            var laser = laserPool.get();
            laser.init(this, 2000, 0.5);
            core.soundEngine.playSingle('shot', {

            });
            return laser;
        }.bind(this);
        this.update = function(core, delta) {
            this.particleGroup.tick(delta);

            currentLifeTime += delta;
            if (currentLifeTime > lifeTime) {
                currentLifeTime = lifeTime;
            }

            this.particleEmitter.alive = (lifeTime - currentLifeTime) / lifeTime;

            var bone = this.bones.fire;
            if (bone != undefined) {
                tmpMatrix.copy(bone.matrixWorld);
                tmpMatrixRotation.makeRotationY(Math.PI * 0.5);
                tmpMatrix.multiply(tmpMatrixRotation);
                this.particleGroup.mesh.position.setFromMatrixPosition(bone.matrixWorld);
                this.particleGroup.mesh.rotation.setFromRotationMatrix(tmpMatrix);
            }

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
        this.requiredEnergy = 10;
    };
    Weapon.prototype.lookAt = function(worldPosition) {
        this.mesh.lookAt(this.ship.mesh.worldToLocal(worldPosition));
    };

    Weapon.prototype.serialize = function(buffer) {
        buffer.push(this.mesh.quaternion.x);
        buffer.push(this.mesh.quaternion.y);
        buffer.push(this.mesh.quaternion.z);
        buffer.push(this.mesh.quaternion.w);
    };
    Weapon.prototype.deserialize = function(offset, data) {
        this.mesh.quaternion.set(data[offset], data[offset + 1], data[offset + 2], data[offset + 3]);
        return offset + 4;
    };
    return Weapon;
});
