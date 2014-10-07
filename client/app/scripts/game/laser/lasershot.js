define(['./basiclaser', 'SPE', 'three', '../../core/core'], function(BasicLaser, SPE, THREE, Core) {
    'use strict';
    var explosionGroup = new SPE.Group({
        texture: THREE.ImageUtils.loadTexture('assets/textures/smokeparticle.png'),
        maxAge: 0.5
    });
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
    explosionGroup.addPool(10, explosionSettings, true);
    Core.effectsNode.add(explosionGroup.mesh);
    explosionGroup.mesh.frustumCulled = false;
    Core.frameListeners.push(function(_, delta) {
        explosionGroup.tick(delta);
    });
    return function(core) {
        var weapon, maxLength, lifeTime, currentLifeTime;
        var node = new THREE.Object3D();
        var percute = false;

        this.laser = new BasicLaser();
        this.laser.mesh.position.set(0,0,0);
        this.laser.mesh.visible = false;
        core.effectsNode.add(node);
        node.add(this.laser.mesh);

        var update = function(_, delta) {
            var laserMesh = this.laser.mesh;
            if(laserMesh.visible) {
                currentLifeTime += delta;
                var scale = (lifeTime - currentLifeTime) / lifeTime;
                laserMesh.scale. y = laserMesh.scale.z = scale;
                laserMesh.visible = currentLifeTime < lifeTime;
                this.laser.material.color = this.initialColor.clone().multiplyScalar(scale);
            }
        }.bind(this);

        core.frameListeners.push(update);

        var randomRotation = new THREE.Matrix4();

        this.init = function(p_weapon,p_length,p_lifeTime) {
            weapon = p_weapon;
            maxLength = p_length;
            lifeTime = p_lifeTime;
            currentLifeTime = 0;
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

            node.position.set(0,0,0);
            randomRotation.makeRotationAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
            matrixWorld.multiply(randomRotation);

            node.rotation.setFromRotationMatrix(matrixWorld);
            this.laser.resetMaterialColor();
            this.initialColor = this.laser.material.color.clone();

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
                    console.log(currentMesh);
                    if(currentMesh === weapon.mesh || currentMesh === weapon.mesh.parent) {
                        continue;
                    } else {
                        var position = intersects[i].point;
                        var distance = position.distanceTo(weapon.mesh.position);
                        if(distance < maxLength) {
                            explosionGroup.triggerPoolEmitter(1, position);
                            scale = distance;
                            percute = currentMesh;
                        }
                        break;
                    }
                }
            }
            this.laser.mesh.scale.set(scale, 1, 1);
            this.laser.mesh.visible = true;
            weapon.mesh.localToWorld(node.position);
        };
        this.isFree = function() {
            return !this.laser.mesh.visible;
        };

        this.serialize = function() {
            return {
                scale: this.laser.mesh.scale.x,
                position: node.position,
                rotation: node.quaternion,
                hit: percute !== false
            };
        };
    }
});
