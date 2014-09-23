define(['./laser/basiclaser'], function(laser) {
    return function(weapon, scene, maxLength) {
        weapon.mesh.updateMatrixWorld(true);
        var matrixWorld = weapon.mesh.matrixWorld.clone();
        var raycaster = new THREE.Raycaster();
        raycaster.ray.origin.setFromMatrixPosition(matrixWorld);
        matrixWorld.setPosition(new THREE.Vector3(0,0,0));
        raycaster.ray.direction = new THREE.Vector3(1,0,0).applyMatrix4(matrixWorld).normalize();
        var intersects = raycaster.intersectObjects(scene.children, true);
        var scale = maxLength;
        var percute = false;
        if(intersects.length > 0) {
            var position = intersects[0].point;
            var distance = position.distanceTo(weapon.mesh.position);
            if(distance < maxLength) {
                scale = distance;
                percute = true;
            }
        }
        this.laser = new laser();
        this.laser.mesh.scale.x = scale;
        this.laser.mesh.position.set(0,0,0);
        weapon.mesh.localToWorld(this.laser.mesh.position);
        this.laser.mesh.rotation.setFromRotationMatrix(weapon.mesh.matrixWorld);
        scene.add(this.laser.mesh);
    }
});
