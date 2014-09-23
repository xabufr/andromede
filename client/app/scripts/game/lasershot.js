define(['./laser/basiclaser'], function(laser) {
    return function(weapon, scene, maxLength) {
        weapon.mesh.updateMatrixWorld();
        var matrixWorld = weapon.matrixWorld.clone();
        var raycaster = new THREE.Raycaster();
        raycaster.ray.origin.getPositionFromMatrix(matrixWorld);
        matrixWorld.setPosition(new THREE.Vector3(0,0,0));
        raycaster.direction.set(new THREE.Vector3(1,0,0).applyMatrix4(matrixWorld).normalize());
        var intersects = raycaster.intersectObjects(scene.childen);
        var scale = maxLength;
        var percute = false;
        if(intersects.length > 0) {
            var position = intersects[0].point;
            var distance = position.distanceTo(weapon.localToWorld(new THREE.Vector3(0,0,0)));
            if(distance < maxLength) {
                scale = distance;
                percute = true;
            }
        }

        this.laser = new laser();
        this.laser.mesh.scale.x = scale;
        this.laser.mesh.position.getPositionFromMatrix(weapon.matrixWorld);
        this.laser.mesh.rotation.setFromMatrix(matrixWorld);
        scene.add(this.laser.mesh);
    }
});
