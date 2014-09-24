define(['three', 'game/input', 'game/spaceShipControl'], function(THREE, input, SpaceShipControl) {
    'use strict';
    return function SpaceShip(core){
        this.mesh = new THREE.Mesh(core.assetsLoader.get('spaceShip').geometry,
            new THREE.MeshLambertMaterial(core.assetsLoader.get('spaceShip').materials));
        this.mesh.receiveShadow = true;
        this.control = new SpaceShipControl(this.mesh);

        core.scene.add(this.mesh);
        var that = this;
        this.move = function(render, delta){
            var input = render.input;

            var percenty = input.mouse.abs.x / window.innerWidth - 0.5;
            var percentx = input.mouse.abs.y / window.innerHeight - 0.5;

            that.control.changePitch(percentx, delta);
            that.control.changeRoll(percenty, delta);

        };
    }
});
