define(['three', 'game/input', 'game/spaceShipControl', 'SPE', '../core/core'], function(THREE, input, SpaceShipControl, SPE) {
    'use strict';
    var count = 1;

    function SpaceShip(core){
        this.engineParticleGroup = new SPE.Group({
            texture: THREE.ImageUtils.loadTexture('assets/textures/smokeparticle.png'),
            maxAge: 1
        });
        this.engineParticleGroup.mesh.frustumCulled = false;
        core.effectsNode.add(this.engineParticleGroup.mesh);
        this.engineParticleEmitter = new SPE.Emitter({
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
        this.engineParticleGroup.addEmitter(this.engineParticleEmitter);
        this.mesh = new THREE.SkinnedMesh(core.assetsLoader.get('spaceShip').geometry,
            new THREE.MeshFaceMaterial(core.assetsLoader.get('spaceShip').materials));
        this.mesh.receiveShadow = true;
        this.mesh.material.skinning = true;
        this.mesh.name = 'spaceShip'+count++;
        this.weapons = [];
        this.control = new SpaceShipControl(this);
        this.enginePower = 0.0;

         this.maxVelocity = 5;

        core.objectsNode.add(this.mesh);

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
    }

    SpaceShip.prototype.incrementEnginePower = function(value) {
        this.enginePower += value;
        this.enginePower = Math.min(1, Math.max(0, this.enginePower));
    };

    SpaceShip.prototype.serialize = function() {
        var state = {
            position: this.mesh.position,
            rotation: {
                x: this.mesh.quaternion.x,
                y: this.mesh.quaternion.y,
                z: this.mesh.quaternion.z,
                w: this.mesh.quaternion.w
            },
            enginePower: this.enginePower
        };
        return state;
    };

    SpaceShip.prototype.deserialize = function(state) {
        this.mesh.position.copy(state.position);
        this.mesh.quaternion.copy(state.rotation);
        this.enginePower = state.enginePower;
    };

    SpaceShip.prototype.update = function(core, delta) {
        this.engineParticleGroup.tick(delta);
        for (var i=0; i < this.mesh.skeleton.bones.length; ++i){
            var bone = this.mesh.skeleton.bones[i];
            if (bone.name === 'engine1') {
                this.engineParticleEmitter.position.setFromMatrixPosition(bone.matrixWorld);
                this.engineParticleEmitter.alive = this.enginePower;
            }
        }
        var input = core.input;

        var deplacement = delta * this.maxVelocity * this.enginePower;
        this.mesh.translateZ(deplacement);

        if (!core.cursor.isInNoneActionArea()) {
            var percenty = input.mouse.abs.x / window.innerWidth - 0.5;
            var percentx = input.mouse.abs.y / window.innerHeight - 0.5;

            this.control.changePitch(percentx, delta);
            this.control.changeRoll(percenty, delta);
        }

        this.weaponUpdate(core, delta);
        this.control.update(core, delta);
    };

    SpaceShip.prototype.destroy = function () {

    };

    return SpaceShip;
});
