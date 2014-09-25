define(['three'], function(THREE){
    return function Camera(target, distance) {
        this.distance = distance;
        this.threeCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.target = target;

        this.update = function() {
            this.threeCamera.position.set(0, 0, this.target.position.z - this.distance);
            this.threeCamera.lookAt(this.target.position);
        }.bind(this);

        this.setTarget = function(target) {
            this.target = target;
            this.target.add(this.threeCamera);
            this.update();
        }.bind(this);

        this.setDistance = function(distance) {
            this.distance = distance;
            this.update();
        }.bind(this);
    };
})