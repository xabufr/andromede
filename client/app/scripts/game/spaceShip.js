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
        this.bones = {};
        this.lockedTarget = null;

        for (var i=0; i < this.mesh.skeleton.bones.length; i++) {
            var bone = this.mesh.skeleton.bones[i];
            this.bones[bone.name] = bone;
        }

        this.mesh.userData = {
            type: 'spaceship',
            object: this
        };
        this.weapons = [];
        this.onDamage = null;

        core.objectsNode.add(this.mesh);

        this.setWeapon = function(weapon) {
            weapon.ship = this;
            var bone = this.bones[weapon.mesh.name];
            if (bone != undefined) {
                weapon.mesh.position.setFromMatrixPosition(bone.matrixWorld);
                this.mesh.add(weapon.mesh);
                this.weapons.push(weapon);
                return;
            }
            throw 'Cannot attach weapon';
        };

        this.weaponUpdate = function(core,delta) {
            var hits = [];
            for (var i=0; i < this.weapons.length; ++i) {
                var weapon = this.weapons[i];
                weapon.isFiring = (this.isReallyShotting && this.energy > weapon.requiredEnergy);
                var shot = weapon.update(core, delta);
                if (shot !== false) {
                    this.energy -= weapon.requiredEnergy;
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
            maxLife: 100 | 0,
            energy: {
                max: 100,
                generation: 25
            }
        };

        this.network = null;
        this.onDie = null;
        this.player = null;
        this.target = null;
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
            },
            serialize: function(buffer) {
                buffer.push(this.engine.power);
                buffer.push(this.engine.velocity);
                buffer.push(this.rotation.x.power);
                buffer.push(this.rotation.x.velocity);
                buffer.push(this.rotation.y.power);
                buffer.push(this.rotation.y.velocity);
            },
            deserialize: function(offset, buffer) {
                this.engine.power = buffer[offset + 0];
                this.engine.velocity = buffer[offset + 1];
                this.rotation.x.power = buffer[offset + 2];
                this.rotation.x.velocity = buffer[offset + 3];
                this.rotation.y.power = buffer[offset + 4];
                this.rotation.y.velocity = buffer[offset + 5];
                return offset + 6;
            }
        };
        this.isReallyShotting = false;
        this.life = this.modelProperties.maxLife;
        this.energy = this.modelProperties.energy.max;
        this.mesh.position.set(0,0,0);
        this.mesh.rotation.set(0,0,0);
    };

    SpaceShip.prototype.incrementEnginePower = function(value) {
        this.physic.engine.power += value;
        this.physic.engine.power = Math.min(1, Math.max(0, this.physic.engine.power));
    };

    SpaceShip.prototype.serialize = function() {
        var data = [];
        data[0] = this.mesh.position.x;
        data[1] = this.mesh.position.y;
        data[2] = this.mesh.position.z;
        data[3] = this.mesh.quaternion.x;
        data[4] = this.mesh.quaternion.y;
        data[5] = this.mesh.quaternion.z;
        data[6] = this.mesh.quaternion.w;
        data[7] = this.life;
        this.physic.serialize(data);
        for(var i=0; i<this.weapons.length;++i) {
            this.weapons[i].serialize(data);
        }
        return new Float32Array(data).buffer;
    };

    SpaceShip.prototype.deserialize = function(state) {
        var data = new Float32Array(state);
        this.mesh.position.x = data[0];
        this.mesh.position.y = data[1];
        this.mesh.position.z = data[2];
        this.mesh.quaternion.x = data[3];
        this.mesh.quaternion.y = data[4];
        this.mesh.quaternion.z = data[5];
        this.mesh.quaternion.w = data[6];
        this.life = data[7];
        var offset = this.physic.deserialize(8, data);
        for(var i=0; i<this.weapons.length;++i) {
            offset = this.weapons[i].deserialize(offset, data);
        }
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
        var bone = this.bones['engine1'];
        if (bone != undefined) {
            this.engineParticleEmitter.position.setFromMatrixPosition(bone.matrixWorld);
            this.engineParticleEmitter.alive = this.physic.engine.power;
        }
        this.physic.rotation.x.velocity = computeNewVelocity(this.modelProperties.maniability.max.x, this.modelProperties.maniability.accelertion.x, this.physic.rotation.x, delta);
        this.physic.rotation.y.velocity = computeNewVelocity(this.modelProperties.maniability.max.y, this.modelProperties.maniability.accelertion.y, this.physic.rotation.y, delta);
        this.mesh.rotateX(this.physic.rotation.x.velocity * delta);
        this.mesh.rotateY(this.physic.rotation.y.velocity * delta);

        this.physic.engine.velocity = computeNewVelocity(this.modelProperties.engine.max, this.modelProperties.engine.acceleration, this.physic.engine, delta);
        var deplacement = delta * this.physic.engine.velocity;
        this.mesh.translateZ(deplacement);
        this.energy = Math.min(this.modelProperties.energy.max, this.energy + delta * this.modelProperties.energy.generation);

        return this.weaponUpdate(core, delta);
    };

    SpaceShip.prototype.remove = function () {
        this.core.objectsNode.remove(this.mesh);
        this.core.effectsNode.remove(this.engineParticleGroup.mesh);
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
        if(this.onDamage) {
            this.onDamage(this, damage);
        }
        if(!this.isAlive() && this.onDie) {
            this.onDie(this);
        }
    };

    SpaceShip.prototype.isAlive = function() {
        return this.life > 0;
    };

    SpaceShip.prototype.weaponLookAt = function(worldPosition) {
        for(var i=0;i<this.weapons.length; ++i) {
            this.weapons[i].lookAt(worldPosition.clone());
        }
    };

    SpaceShip.prototype.die = function() {
        this.remove();
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

    SpaceShip.prototype.lifePercent = function() {
        return this.life / this.modelProperties.maxLife;
    };

    SpaceShip.prototype.energyPercent = function() {
        return this.energy / this.modelProperties.energy.max;
    };

    return SpaceShip;
});
