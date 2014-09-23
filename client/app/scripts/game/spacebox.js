define(['three'], function(THREE) {
    'use strict';
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
    var geometry = new THREE.BoxGeometry(100, 100, 100);
    var material = new THREE.ShaderMaterial({
       fragmentShader: spaceShader.fragmentShader,
        vertexShader: spaceShader.vertexShader,
        uniforms: spaceShader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
    });
    var mesh = new THREE.Mesh(geometry, material);

    return mesh;
});
