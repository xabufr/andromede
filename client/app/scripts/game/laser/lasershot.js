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
        var particleGroup = new SPE.Group({
            texture: THREE.ImageUtils.loadTexture('assets/textures/smokeparticle.png'),
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

        this.init = function(p_weapon,p_length,p_lifeTime) {
            weapon = p_weapon;
            maxLength = p_length;
            lifeTime = p_lifeTime;
            currentLifeTime = 0;
            particleEmitter.alive = 1.0;

            weapon.mesh.updateMatrixWorld(true);
            var matrixWorld = weapon.mesh.matrixWorld.clone();

            matrixWorld.makeRotationAxis(new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(), (Math.random() - 0.5) * weapon.imprecision);

            node.position.set(0,0,0);
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
            var percute = false;
            if(intersects.length > 0) {
                for(var i=0; i < intersects.length; ++i) {
                    var currentMesh = intersects[i].object;
                    if(currentMesh === weapon.mesh) {
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
    }
});
