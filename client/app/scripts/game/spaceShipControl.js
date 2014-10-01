define([], function(){
    function SpaceShipControl(ship){
        this.ship = ship;
    };

    SpaceShipControl.prototype.maxRotation = Math.PI;


    SpaceShipControl.prototype.update = function(core, delta) {
        var powerValue = core.input.mouse.rel.z;
        if(powerValue != 0) {
            this.ship.incrementEnginePower(powerValue < 0 ? 0.1 : -0.1);
        }

        var input = core.input;
        if (core.input.mouse.buttons.left) {
            var percenty = (input.mouse.abs.x / window.innerWidth - 0.5) * 2;
            var percentx = (input.mouse.abs.y / window.innerHeight - 0.5) * 2;

            this.ship.turnUpDown(percentx);
            this.ship.turnRightLeft(-percenty);
        } else {
            this.ship.turnUpDown(0);
            this.ship.turnRightLeft(0);
        }
        this.ship.isReallyShotting = core.input.mouse.buttons.right;
    };

    return SpaceShipControl;
});