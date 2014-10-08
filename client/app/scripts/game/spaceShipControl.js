define(['three'], function(THREE){
    'use strict';
    var projector = new THREE.Projector(),
        vector = new THREE.Vector3();

    function SpaceShipControl(ship){
        this.ship = ship;
    }

    SpaceShipControl.prototype.update = function(core, delta) {
        var powerValue = core.input.mouse.rel.z;
        if(powerValue != 0) {
            this.ship.incrementEnginePower(powerValue < 0 ? 0.1 : -0.1);
        }

        vector.set((core.input.mouse.abs.x / window.innerWidth) * 2 - 1,
                -2 * (core.input.mouse.abs.y / window.innerHeight) + 1, 0);

        var raycaster = projector.pickingRay(vector.clone(), core.camera.threeCamera);
        var intersects = raycaster.intersectObjects(core.objectsNode.children, true);

        if (intersects.length > 0 && intersects[0].object !== this.ship.mesh) {
            if (intersects[0].object.name.indexOf("spaceShip") !== -1
                && intersects[0].object.name !== this.ship.mesh.name ) {
                core.cursor.changeColor('red');
            }
            this.ship.weaponLookAt(intersects[0].point);
        }
        else {
            core.cursor.changeColor('green');
            this.ship.weaponLookAt(raycaster.ray.at(2000));
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