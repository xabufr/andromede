define(['three', 'game/input', 'game/spaceShipControl'], function(THREE, input, SpaceShipControl) {
    'use strict';
    return function SpaceShip(core){

        this.mesh = new THREE.Mesh(core.assetsLoader.get('spaceShip').geometry,
            new THREE.MeshLambertMaterial(core.assetsLoader.get('spaceShip').materials));
        this.mesh.receiveShadow = true;
        this.control = new SpaceShipControl(this.mesh);
        this.enginePower = 0.0;

        var maxVelocity = 5;

        core.objectsNode.add(this.mesh);
        this.move = function(render, delta){
            var input = render.input;

            var percenty = input.mouse.abs.x / window.innerWidth - 0.5;
            var percentx = input.mouse.abs.y / window.innerHeight - 0.5;

            this.enginePower += (input.mouse.rel.z == 0 ? 0 : (input.mouse.rel.z < 0 ? 10 : -10));
            this.enginePower = Math.min(1, Math.max(0, this.enginePower));

            var deplacement = delta * maxVelocity * this.enginePower;
            this.mesh.translateZ(deplacement);

            this.control.changePitch(percentx, delta);
            this.control.changeRoll(percenty, delta);
        }.bind(this);
    }
});
