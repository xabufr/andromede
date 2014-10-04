define(['three'], function(THREE) {
    var flare0 = THREE.ImageUtils.loadTexture('assets/textures/sun/lensflare0.png');
    var flare2 = THREE.ImageUtils.loadTexture('assets/textures/sun/lensflare2.png');
    var flare3 = THREE.ImageUtils.loadTexture('assets/textures/sun/lensflare3.png');
    function Sun(position, size, color, core) {
        this.effectNode = new THREE.Object3D();
        this.effectNode.position.copy(position);
        this.light = new THREE.PointLight(color, 1.5, 500000);
        this.light.shadowCameraVisible = true;
        this.effectNode.add(this.light);
        var flareColor = new THREE.Color( 0xffffff );
        flareColor.setHSL( 0.55, 0.9, 0.5 + 0.5 );

        this.lensflare = new THREE.LensFlare(flare0, size, 0.0, THREE.AdditiveBlending, flareColor);
        this.lensflare.add(flare3, 60, 0.6, THREE.AdditiveBlending );
        this.lensflare.add(flare3, 70, 0.7, THREE.AdditiveBlending );
        this.lensflare.add(flare3, 120, 0.9, THREE.AdditiveBlending );
        this.lensflare.add(flare3, 70, 1.0, THREE.AdditiveBlending );
        this.lensflare.position.copy(position);


        core.effectsNode.add(this.effectNode);
        core.effectsNode.add(this.lensflare);
    }

    return Sun;
});
