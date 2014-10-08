define(['three', 'three.targetcamera'], function(THREE, THREETargetCamera){
    'use strict';
    return function Camera(target, distance) {
        this.distance = distance;
        this.threeCamera = new THREETargetCamera(45, window.innerWidth / window.innerHeight, 0.1, 50000);
        this.target = target;

        this.update = function(core, delta) {
            if(this.target === null) {
                return;
            }
            if(core.input.isKeyDown(86)) {
                this.threeCamera.setTarget('ship-back');
            } else {
                this.threeCamera.setTarget('ship');
            }
            this.threeCamera.update(delta);
        }.bind(this);

        this.setTarget = function(target) {
            this.target = target;
            this.threeCamera.addTarget({
                name: 'ship',
                targetObject: this.target,
                cameraPosition: new THREE.Vector3(0, 1.5, 10),
                cameraRotation: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI),
                fixed: false,
                stiffness: 0.09,
                matchRotation: true
            });
            this.threeCamera.addTarget({
                name: 'ship-back',
                targetObject: this.target,
                cameraPosition: new THREE.Vector3(0, 1.5, 10),
                fixed: false,
                stiffness: 0.8,
                matchRotation: true
            });
            this.threeCamera.setTarget('ship');

        }.bind(this);
    };
});