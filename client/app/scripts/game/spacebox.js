define(['three'], function(THREE) {
    'use strict';
    return function(core) {
        var urls = [
            'assets/textures/spacebox/right1.png',
            'assets/textures/spacebox/left2.png',
            'assets/textures/spacebox/top3.png',
            'assets/textures/spacebox/bottom4.png',
            'assets/textures/spacebox/front5.png',
            'assets/textures/spacebox/back6.png'
        ];
        var cubeMap = new THREE.ImageUtils.loadTextureCube(urls);
        cubeMap.format = THREE.RGBFormat;
        var spaceShader = THREE.ShaderLib['cube'];
        spaceShader.uniforms['tCube'].value = cubeMap;
        var geometry = new THREE.BoxGeometry(500, 500, 500);
        var materialArray = [];
        for(var i=0;i<6;++i) {
            materialArray.push(new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture(urls[i]),
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
