define(['three', 'game/input', 'game/spaceShipControl', 'SPE', '../core/core'], function(THREE, input, SpaceShipControl, SPE, Core) {
    'use strict';
    var count = 1;

    return function SpaceShip(core){
        var engineParticleGroup = new SPE.Group({
            texture: THREE.ImageUtils.loadTexture('assets/textures/smokeparticle.png'),
            maxAge: 1
        });
        engineParticleGroup.mesh.frustumCulled = false;
        core.effectsNode.add(engineParticleGroup.mesh);
        core.frameListeners.push(function(core, delta) {
            engineParticleGroup.tick(delta);
        });
        var emitter = new SPE.Emitter({
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
        });
        engineParticleGroup.addEmitter(emitter);
        this.mesh = new THREE.SkinnedMesh(core.assetsLoader.get('spaceShip').geometry,
            new THREE.MeshFaceMaterial(core.assetsLoader.get('spaceShip').materials));
        this.mesh.receiveShadow = true;
        this.mesh.material.skinning = true;
        this.mesh.name = 'spaceShip'+count++;
        this.weapons = [];
        this.control = new SpaceShipControl(this);
        core.frameListeners.push(this.control.update);
        this.enginePower = 0.0;

        var maxVelocity = 5;

        core.objectsNode.add(this.mesh);

        this.move = function(core, delta) {
            for (var i=0; i < this.mesh.skeleton.bones.length; ++i){
                var bone = this.mesh.skeleton.bones[i];
                if (bone.name === 'engine1') {
                    emitter.position.setFromMatrixPosition(bone.matrixWorld);
                    emitter.alive = this.enginePower;
                }
            }
            var input = core.input;

            var deplacement = delta * maxVelocity * this.enginePower;
            this.mesh.translateZ(deplacement);

            if (!core.cursor.isInNoneActionArea()) {
                var percenty = input.mouse.abs.x / window.innerWidth - 0.5;
                var percentx = input.mouse.abs.y / window.innerHeight - 0.5;

                this.control.changePitch(percentx, delta);
                this.control.changeRoll(percenty, delta);
            }

            this.weaponUpdate(core, delta);
        }.bind(this);

        this.incrementEnginePower = function(value) {
            this.enginePower += value;
            this.enginePower = Math.min(1, Math.max(0, this.enginePower));
        };

        this.setWeapon = function(weapon) {
            var bones = this.mesh.skeleton.bones;
            for (var i=0; i < bones.length; ++i) {
                if (bones[i].name == weapon.mesh.name) {
                    var bone = bones[i];
                    weapon.mesh.position.setFromMatrixPosition(bone.matrixWorld);
                    this.mesh.add(weapon.mesh);
                    this.weapons.push(weapon);
                }
            }
        };

        this.weaponUpdate = function(core,delta) {
            for (var i=0; i < this.weapons.length; ++i) {
                var weapon = this.weapons[i];
                weapon.isFiring = core.input.mouse.buttons.left;
                weapon.update(core, delta);
            }
        };
        this.setState = function(state) {
            this.mesh.position.copy(state.position);
            this.mesh.quaternion.copy(state.rotation);
            this.enginePower = state.enginePower;
        }
    }
});
