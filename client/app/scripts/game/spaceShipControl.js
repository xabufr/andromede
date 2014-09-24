define([], function(){
    return function SpaceShipControl(mesh){
        var that = this;
        this.mesh = mesh;
        this.maxRotation = Math.PI;
        this.changePitch = function(percent, delta) {
            that.mesh.rotateX(that.maxRotation * delta * percent);
        };

        this.changeRoll = function(percent, delta) {
            that.mesh.rotateY(-(that.maxRotation * delta * percent));
        };

        this.setMaxRotation = function(rotation) {
            that.maxRotation = rotation;
        };
    };
});