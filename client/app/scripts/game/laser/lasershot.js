define(['./basiclaser'], function(BasicLaser) {
    return function(core) {
        var weapon, scene = core.scene, maxLength, lifeTime, currentLifeTime;

        this.laser = new BasicLaser();
        this.laser.mesh.visible = false;
        scene.add(this.laser.mesh);
        var raycaster = new THREE.Raycaster();
        var that = this;

        var update = function(_, delta) {
            var laserMesh = that.laser.mesh;
            if(laserMesh.visible) {
                currentLifeTime += delta;
                var scale = (lifeTime - currentLifeTime) / lifeTime;
                laserMesh.scale. y = laserMesh.scale.z = scale;
                laserMesh.visible = currentLifeTime < lifeTime;
                that.laser.material.color = that.initialColor.clone().multiplyScalar(scale);
            }
        };

        core.frameListeners.push(update);

        this.init = function(p_weapon,p_length,p_lifeTime) {
            weapon = p_weapon;
            maxLength = p_length;
            lifeTime = p_lifeTime;
            currentLifeTime = 0;

            weapon.mesh.updateMatrixWorld(true);
            var matrixWorld = weapon.mesh.matrixWorld.clone();

            this.laser.mesh.rotation.setFromRotationMatrix(matrixWorld);
            this.laser.mesh.position.set(0,0,0);
            this.laser.resetMaterialColor();
            this.initialColor = this.laser.material.color.clone();

            raycaster.ray.origin.setFromMatrixPosition(matrixWorld);
            matrixWorld.setPosition(new THREE.Vector3(0,0,0));
            raycaster.ray.direction = new THREE.Vector3(1,0,0).applyMatrix4(matrixWorld).normalize();
            raycaster.far = maxLength;
            var intersects = raycaster.intersectObjects(scene.children, true);
            var scale = maxLength;
            var percute = false;
            if(intersects.length > 0) {
                var position = intersects[0].point;
                var distance = position.distanceTo(weapon.mesh.position);
                if(distance < maxLength) {
                    scale = distance;
                    percute = intersects[0].object;
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
