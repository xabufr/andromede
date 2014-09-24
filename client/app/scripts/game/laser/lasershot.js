define(['./basiclaser'], function(BasicLaser) {
    'use strict';
    var laserNode = null;
    return function(core) {
        var weapon, scene = core.scene, maxLength, lifeTime, currentLifeTime;

        this.laser = new BasicLaser();
        this.laser.mesh.visible = false;
        core.effectsNode.add(this.laser.mesh);

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

        this.init = function(p_weapon,p_length,p_lifeTime) {
            weapon = p_weapon;
            maxLength = p_length;
            lifeTime = p_lifeTime;
            currentLifeTime = 0;

            weapon.mesh.updateMatrixWorld(true);
            var matrixWorld = weapon.mesh.matrixWorld.clone();

            matrixWorld.makeRotationAxis(new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(), (Math.random() - 0.5) * weapon.imprecision);

            this.laser.mesh.rotation.setFromRotationMatrix(matrixWorld);
            this.laser.mesh.position.set(0,0,0);
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
                            scale = distance;
                            percute = currentMesh;
                            console.log(currentMesh.name);
                            if(currentMesh.name == '') {
                                console.log(currentMesh);
                            }
                        }
                        break;
                    }
                }
            }
            this.laser.mesh.scale.set(scale, 1, 1);
            this.laser.mesh.visible = true;
            weapon.mesh.localToWorld(this.laser.mesh.position);
        };
        this.isFree = function() {
            return !this.laser.mesh.visible;
        };
    }
});
