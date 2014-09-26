define(['three', 'game/input', 'game/spaceShipControl', 'SPE', '../core/core'], function(THREE, input, SpaceShipControl, SPE, Core) {
    'use strict';
    var engineParticleGroup = new SPE.Group({
        texture: THREE.ImageUtils.loadTexture('assets/textures/smokeparticle.png'),
        maxAge: 1
    });
    var engineParticleSettings = {
        type: 'cube',
        velocitySpread: new THREE.Vector3(1, 1, 1),
        sizeStart: 0.5,
        sizeStartSpread: 1,
        sizeEnd: 0,
        opacityStart: 1,
        opacityEnd: 0,
        colorStart: new THREE.Color(0xFF9933),
        colorEnd: new THREE.Color(0xFFFF00),
        particleCount: 1000,
        particlesPerSecond: 25,
        alive: 1
    };
    engineParticleGroup.mesh.frustumCulled = false;
    Core.effectsNode.add(engineParticleGroup.mesh);
    Core.frameListeners.push(function(core, delta) {
        engineParticleGroup.tick(delta);
    });

    return function SpaceShip(core){
        var emitter = new SPE.Emitter(engineParticleSettings);
        engineParticleGroup.addEmitter(emitter);
        this.mesh = new THREE.Mesh(core.assetsLoader.get('spaceShip').geometry,
            new THREE.MeshLambertMaterial(core.assetsLoader.get('spaceShip').materials));
        this.mesh.receiveShadow = true;
        this.control = new SpaceShipControl(this);
        core.frameListeners.push(this.control.update);
        this.enginePower = 0.0;

        var maxVelocity = 5;

        core.objectsNode.add(this.mesh);
        this.move = function(render, delta) {
            emitter.position.copy(this.mesh.position);
            emitter.alive = this.enginePower;
            var input = render.input;

            var deplacement = delta * maxVelocity * this.enginePower;
            this.mesh.translateZ(deplacement);

            if (!core.cursor.isInNoneActionArea()) {
                var percenty = input.mouse.abs.x / window.innerWidth - 0.5;
                var percentx = input.mouse.abs.y / window.innerHeight - 0.5;

                this.control.changePitch(percentx, delta);
                this.control.changeRoll(percenty, delta);
            }
        }.bind(this);

        this.incrementEnginePower = function(value) {
            this.enginePower += value;
            this.enginePower = Math.min(1, Math.max(0, this.enginePower));
        };
        this.network = null;
    }
});
