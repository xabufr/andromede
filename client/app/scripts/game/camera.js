define(['three'], function(THREE){
    return function Camera(target, distance) {
        this.distance = distance;
        this.threeCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.target = target;

        this.update = function(core, delta) {
            if(this.target === null) {
                return;
            }
            var coef = 1;
            if(core.input.isKeyDown(86)) {
                coef = -1;
            }
            this.threeCamera.position.set(0, 0, -this.distance * coef);
            this.threeCamera.lookAt(new THREE.Vector3(0,0,0));
        }.bind(this);

        this.setTarget = function(target) {
            this.target = target;
            this.target.add(this.threeCamera);
        }.bind(this);

        this.setDistance = function(distance) {
            this.distance = distance;
        }.bind(this);
    };
})