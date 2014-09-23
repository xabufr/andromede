define(['three', 'game/input'], function(THREE, input) {
    'use strict';
    return function SpaceShip(core){
        this.mesh = new THREE.Mesh(core.assetsLoader.get('spaceShip').geometry,
            new THREE.MeshLambertMaterial(core.assetsLoader.get('spaceShip').materials));
        this.mesh.receiveShadow = true;
        this.mesh.position.set(0,0,0);

        core.scene.add(this.mesh);
        var that = this;
        this.move = function(render){
            var input = render.input;
            that.mesh.position.x = input.mouse.rel.x;
            that.mesh.position.y = input.mouse.rel.y;
        };
    }
});
