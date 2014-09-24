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

            if (input.mouse.move){
                that.mesh.rotation.x += input.mouse.rel.y * 0.1;
                that.mesh.rotation.y += -input.mouse.rel.x * 0.1;
            }
        };
    }
});
