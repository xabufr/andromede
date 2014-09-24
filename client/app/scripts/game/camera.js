define(['three'], function(THREE){
    return function Camera(target, distance) {
        this.distance = distance;
        this.threeCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.target = target;

        var that = this;
        this.update = function() {
            that.threeCamera.position.set(0, 0, this.target.position.z - that.distance);
            that.threeCamera.lookAt(that.target.position);
        };

        this.setTarget = function(target) {
            that.target = target;
            that.target.add(that.threeCamera);
            that.update();
        };

        this.setDistance = function(distance) {
            that.distance = distance;
            that.update();
        };
    };
})