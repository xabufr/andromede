define(['./laser/basiclaser'], function(BasicLaser) {
    return function(weapon, scene, maxLength) {
        weapon.mesh.updateMatrixWorld(true);
        var matrixWorld = weapon.mesh.matrixWorld.clone();

        this.laser = new BasicLaser();
        this.laser.mesh.rotation.setFromRotationMatrix(matrixWorld);
        this.laser.mesh.position.set(0,0,0);

        var raycaster = new THREE.Raycaster();
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
        this.laser.mesh.scale.x = scale;
        weapon.mesh.localToWorld(this.laser.mesh.position);
        scene.add(this.laser.mesh);
    }
});
