define([], function(){
    return function SpaceShipControl(ship){
        var mesh = ship.mesh;
        this.mesh = mesh;
        this.maxRotation = Math.PI;
        this.changePitch = function(percent, delta) {
            this.mesh.rotateX(this.maxRotation * delta * percent);
        }.bind(this);

        this.changeRoll = function(percent, delta) {
            this.mesh.rotateY(-(this.maxRotation * delta * percent));
        }.bind(this);

        this.setMaxRotation = function(rotation) {
            this.maxRotation = rotation;
        }.bind(this);

        this.update = function(core, delta) {
            var powerValue = core.input.mouse.rel.z;
            if(powerValue != 0) {
                ship.incrementEnginePower(powerValue < 0 ? 0.1 : -0.1);
            }
        }
    };
});