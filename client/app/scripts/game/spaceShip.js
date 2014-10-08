define(['three', 'SPE', './explosion'], function(THREE, SPE, Explosion) {
    'use strict';
    var count = 1;

    function SpaceShip(core){
        this.engineParticleGroup = new SPE.Group({
            texture: core.assetsLoader.get('textures', 'smokeparticle'),
            maxAge: 1
        });
        this.engineParticleGroup.mesh.frustumCulled = false;
        this.core = core;
        core.effectsNode.add(this.engineParticleGroup.mesh);
        this.engineParticleEmitter = new SPE.Emitter({
            type: 'cube',
            velocitySpread: new THREE.Vector3(1, 1, 1),
            sizeStart: 0.5,
            sizeStartSpread: 1,
            sizeEnd: 0,
            opacityStart: 1,
            opacityEnd: 0,
            colorStart: new THREE.Color(0xFF9933),
            colorEnd: new THREE.Color(0xFFFF00),
            particleCount: 1000,
            particlesPerSecond: 25,
            alive: 1
        });
        this.engineParticleGroup.addEmitter(this.engineParticleEmitter);
        this.mesh = new THREE.SkinnedMesh(core.assetsLoader.get('models', 'spaceShip').geometry,
            new THREE.MeshFaceMaterial([new THREE.MeshPhongMaterial({ ambient: 0x333333, color: 0xffffff, specular: 0xffffff, shininess: 50 })]));
        this.mesh.receiveShadow = true;
        this.mesh.material.skinning = true;
        this.mesh.name = 'spaceShip'+count++;
        this.mesh.userData = {
            type: 'spaceship',
            object: this
        };
        this.weapons = [];

        core.objectsNode.add(this.mesh);

        this.setWeapon = function(weapon) {
            weapon.ship = this;
            var bones = this.mesh.skeleton.bones;
            for (var i=0; i < bones.length; ++i) {
                if (bones[i].name == weapon.mesh.name) {
                    var bone = bones[i];
                    weapon.mesh.position.setFromMatrixPosition(bone.matrixWorld);
                    this.mesh.add(weapon.mesh);
                    this.weapons.push(weapon);
                    return;
                }
            }
            throw 'Cannot attach weapon';
        };

        this.weaponUpdate = function(core,delta) {
            var hits = [];
            for (var i=0; i < this.weapons.length; ++i) {
                var weapon = this.weapons[i];
                weapon.isFiring = this.isReallyShotting;
                var shot = weapon.update(core, delta);
                if (shot !== false) {
                    if(shot.getHit()) {
                        hits.push(shot.getHit());
                    }
                    if (this.network) {
                        this.network.sendShot({
                            weapon: i,
                            shot: shot.serialize()
                        });
                    }
                }
            }
            return hits;
        };

        this.modelProperties = {
            engine: {
                max: 10,
                acceleration: 2.5
            },
            maniability: {
                max: {
                    x: Math.PI / 2,
                    y: Math.PI / 2
                },
                accelertion: {
                    x: Math.PI * 0.3,
                    y: Math.PI * 0.3
                }
            },
            maxLife: 100 | 0
        };

        this.reset();
        this.network = null;
        this.onDie = null;
        this.player = null;
        this.reset();
    }

    SpaceShip.prototype.reset = function() {
        this.physic = {
            engine: {
                power: 0,
                velocity: 0
            },
            rotation: {
                x: {
                    power: 0,
                    velocity: 0
                },
                y: {
                    power: 0,
                    velocity: 0
                }
            },
            copy: function(other) {
                this.engine.power = other.engine.power;
                this.engine.velocity = other.engine.velocity;
                this.rotation.x.power = other.rotation.x.power;
                this.rotation.x.velocity = other.rotation.x.velocity;
                this.rotation.y.power = other.rotation.y.power;
                this.rotation.y.velocity = other.rotation.y.velocity;
            }
        };
        this.isReallyShotting = false;
        this.life = this.modelProperties.maxLife;
        this.mesh.position.set(0,0,0);
        this.mesh.rotation.set(0,0,0);
    };

    SpaceShip.prototype.incrementEnginePower = function(value) {
        this.physic.engine.power += value;
        this.physic.engine.power = Math.min(1, Math.max(0, this.physic.engine.power));
    };

    SpaceShip.prototype.serialize = function() {
        var state = {
            position: this.mesh.position,
            rotation: {
                x: this.mesh.quaternion.x,
                y: this.mesh.quaternion.y,
                z: this.mesh.quaternion.z,
                w: this.mesh.quaternion.w
            },
            physic: this.physic,
            life: this.life
        };
        return state;
    };

    SpaceShip.prototype.deserialize = function(state) {
        this.mesh.position.copy(state.position);
        this.mesh.quaternion.copy(state.rotation);
        this.physic.copy(state.physic);
        this.life = state.life;
    };

    function computeNewVelocity(max, acceleration, physic, delta) {
        var targetVelocity = physic.power * max;
        var diff = (physic.velocity - targetVelocity);
        if (Math.abs(diff) > acceleration * delta) {
            diff = acceleration * (diff > 0 ? 1 : -1);
        }
        return physic.velocity - diff * delta;
    }

    SpaceShip.prototype.update = function(core, delta) {
        this.engineParticleGroup.tick(delta);
        for (var i=0; i < this.mesh.skeleton.bones.length; ++i){
            var bone = this.mesh.skeleton.bones[i];
            if (bone.name === 'engine1') {
                this.engineParticleEmitter.position.setFromMatrixPosition(bone.matrixWorld);
                this.engineParticleEmitter.alive = this.physic.engine.power;
            }
        }
        this.physic.rotation.x.velocity = computeNewVelocity(this.modelProperties.maniability.max.x, this.modelProperties.maniability.accelertion.x, this.physic.rotation.x, delta);
        this.physic.rotation.y.velocity = computeNewVelocity(this.modelProperties.maniability.max.y, this.modelProperties.maniability.accelertion.y, this.physic.rotation.y, delta);
        this.mesh.rotateX(this.physic.rotation.x.velocity * delta);
        this.mesh.rotateY(this.physic.rotation.y.velocity * delta);

        this.physic.engine.velocity = computeNewVelocity(this.modelProperties.engine.max, this.modelProperties.engine.acceleration, this.physic.engine, delta);
        var deplacement = delta * this.physic.engine.velocity;
        this.mesh.translateZ(deplacement);

        return this.weaponUpdate(core, delta);
    };

    SpaceShip.prototype.remove = function () {
        this.core.objectsNode.remove(this.mesh);
        this.core.effectsNode.remove(this.engineParticleGroup);
    };

    SpaceShip.prototype.turnUpDown = function(percent) {
        this.physic.rotation.x.power = percent;
    };

    SpaceShip.prototype.turnRightLeft = function(percent) {
        this.physic.rotation.y.power = percent;
    };

    SpaceShip.prototype.shotFromData = function(shotData) {
        var weapon = this.weapons[shotData.weapon];
        if(weapon) {
            weapon.shotFromData(shotData.shot);
        }
    };

    SpaceShip.prototype.sufferDamages = function (damage) {
        this.life -= damage;
        if(!this.isAlive() && this.onDie) {
            this.onDie(this);
        }
    };

    SpaceShip.prototype.isAlive = function() {
        return this.life > 0;
    };

    SpaceShip.prototype.die = function() {
        this.mesh.parent.remove(this.mesh);
        this.engineParticleGroup.mesh.parent.remove(this.engineParticleGroup.mesh);
        new Explosion(this.core, [
            {
                position: this.mesh.position,
                power: 40
            },
            {
                position: this.mesh.position,
                power: 50,
                delay: 0.4
            },
            {
                position: this.mesh.position,
                power: 50,
                delay: 0.6
            },
            {
                position: this.mesh.position,
                power: 100,
                delay: 0.9
            }
        ]);
    };

    return SpaceShip;
});
