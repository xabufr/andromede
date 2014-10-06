define(['three'], function(THREE) {
    'use strict';
    return function(core) {
        var geometry = new THREE.BoxGeometry(500, 500, 500);
        var materialArray = [];
        for(var i=0;i<6;++i) {
            materialArray.push(new THREE.MeshBasicMaterial({
                map: core.assetsLoader.get('textures', 'spacebox')[i],
                side: THREE.BackSide,
                depthWrite: false
            }));
        }
        var material = new THREE.MeshFaceMaterial(materialArray);
        var mesh = new THREE.Mesh(geometry, material);
        mesh.name = 'skybox';
        core.sceneFirstPass.add(mesh);
        core.beforeRenderListeners.push(function(core) {
            mesh.position.set(0,0,0);
            core.camera.threeCamera.localToWorld(mesh.position);
        }.bind(this));
    }
});
