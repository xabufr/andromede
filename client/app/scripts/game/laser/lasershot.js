define(['./basiclaser', 'SPE', 'three', '../../core/core'], function(BasicLaser, SPE, THREE) {
    'use strict';
    var explosionGroup =  null;
    var explosionSettings = {
        type: 'sphere',
        positionSpread: new THREE.Vector3(10, 10, 10),
        radius: 0.25,
        speed: 4,
        sizeStart: 0.5,
        sizeStartSpread: 0.5,
        sizeEnd: 0,
        opacityStart: 1,
        opacityEnd: 0,
        colorStart: new THREE.Color(0x4444aa),
        colorStartSpread: new THREE.Vector3(1, 1, 1),
        colorEnd: new THREE.Color('blue'),
        particleCount: 200,
        alive: 0,
        duration: 0.05
    };
    return function(core) {
        if(explosionGroup === null) {
            explosionGroup = new SPE.Group({
                texture: core.assetsLoader.get('textures', 'smokeparticle'),
                maxAge: 0.5
            });
            explosionGroup.addPool(10, explosionSettings, true);
            core.effectsNode.add(explosionGroup.mesh);
            explosionGroup.mesh.frustumCulled = false;
            core.frameListeners.push(function(_, delta) {
                explosionGroup.tick(delta);
            });
        }
        var particleGroup = new SPE.Group({
            texture: core.assetsLoader.get('textures', 'smokeparticle'),
            maxAge: 0.5
        });
        var particleEmitter = new SPE.Emitter({
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
        particleGroup.addEmitter(particleEmitter);
        var weapon, maxLength, lifeTime, currentLifeTime;
        var node = new THREE.Object3D();
        var percute = false;

        this.laser = new BasicLaser();
        this.laser.mesh.position.set(0,0,0);
        this.laser.mesh.visible = false;
        core.effectsNode.add(node);
        node.add(this.laser.mesh);
        node.add(particleGroup.mesh);

        var update = function(_, delta) {
            var laserMesh = this.laser.mesh;
            particleGroup.tick(delta);
            if(laserMesh.visible) {
                currentLifeTime += delta;
                var scale = (lifeTime - currentLifeTime) / lifeTime;
                laserMesh.scale. y = laserMesh.scale.z = scale;
                particleEmitter.alive = scale;
                laserMesh.visible = currentLifeTime < lifeTime;
                this.laser.material.color = this.initialColor.clone().multiplyScalar(scale);
            } else {
                particleEmitter.alive = 0.0;
            }
        }.bind(this);

        core.frameListeners.push(update);

        var randomRotation = new THREE.Matrix4();

        this.init = function(p_weapon, p_length, p_lifeTime) {
            weapon = p_weapon;
            maxLength = p_length;
            percute = false;

            var matrixWorld = null;
            for (var i=0; i < weapon.mesh.skeleton.bones.length; ++i) {
                var bone = weapon.mesh.skeleton.bones[i];
                if (bone.name === 'fire') {
                    bone.updateMatrixWorld(true);
                    matrixWorld = bone.matrixWorld.clone();
                }
            }

            if (matrixWorld === null) {
                return;
            }

            randomRotation.makeRotationAxis(new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(), (Math.random() - 0.5) * weapon.imprecision);
            matrixWorld.multiply(randomRotation);

            randomRotation.makeRotationAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
            matrixWorld.multiply(randomRotation);

            node.position.set(0,0,0);
            node.rotation.setFromRotationMatrix(matrixWorld);

            var raycaster = new THREE.Raycaster();
            raycaster.ray.origin.setFromMatrixPosition(matrixWorld);
            matrixWorld.setPosition(new THREE.Vector3(0,0,0));
            raycaster.ray.direction = new THREE.Vector3(1,0,0).applyMatrix4(matrixWorld).normalize();
            raycaster.far = maxLength;
            var intersects = raycaster.intersectObjects(core.objectsNode.children, true);
            var scale = maxLength;
            if(intersects.length > 0) {
                for(var i=0; i < intersects.length; ++i) {
                    var currentMesh = intersects[i].object;
                    if(currentMesh === weapon.mesh) {
                        continue;
                    } else {
                        var position = intersects[i].point;
                        var distance = position.distanceTo(weapon.mesh.localToWorld(new THREE.Vector3(0,0,0)));
                        if(distance < maxLength) {
                            scale = distance;
                            percute = {
                                mesh: currentMesh,
                                position: position,
                                weapon: weapon
                            };
                        }
                        break;
                    }
                }
            }
            weapon.mesh.localToWorld(node.position);

            this.initFromData(p_weapon, p_lifeTime, {
                position: node.position,
                scale: scale,
                rotation: node.quaternion,
                hit: (percute === false ? false : percute)
            });
            return percute;
        };

        this.initFromData = function(p_weapon, p_lifeTime, data) {
            particleEmitter.alive = 1.0;
            currentLifeTime = 0;
            weapon = p_weapon;
            lifeTime = p_lifeTime;
            this.laser.resetMaterialColor();
            this.initialColor = this.laser.material.color.clone();
            this.laser.mesh.visible = true;
            node.position.copy(data.position);
            node.quaternion.copy(data.rotation);
            this.laser.mesh.scale.set(data.scale, 1, 1);
            if(data.hit !== false) {
                explosionGroup.triggerPoolEmitter(1, data.hit.position);
            } else {
            }
        };

        this.isFree = function() {
            return !this.laser.mesh.visible;
        };

        this.serialize = function() {
            var hitData = false;
            if(percute !== false) {
                hitData = {
                    position: percute.position
                };
                if(percute.mesh.userData.type === 'spaceship') {
                    hitData.player = percute.mesh.userData.object.player.id;
                }
            }
            return {
                scale: this.laser.mesh.scale.x,
                position: node.position,
                rotation: {
                    x: node.quaternion.x,
                    y: node.quaternion.y,
                    z: node.quaternion.z,
                    w: node.quaternion.w
                },
                hit: hitData
            };
        };
        this.getHit = function() {
            return percute;
        };
    }
});
