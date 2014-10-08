define(['SPE'], function(SPE) {
    "use strict";
    var explosions = {};
    var lastId = 0;
    var update = function(Core, delta) {
        var explosionKeys = Object.keys(explosions);
        for(var i=0; i<explosionKeys.length;++i) {
            var key = explosionKeys[i];
            if(explosions[key].update(Core, delta)) {
                delete explosions[key];
            }
        }
    };
    var initialized = false;
    function Explosion(Core, parameters) {
        this.id = lastId++;
        this.node = new THREE.Object3D();
        explosions[this.id] = this;
        if(initialized === false) {
            initialized = true;
            Core.frameListeners.push(update);
        }
        this.explosions = [];
        Core.effectsNode.add(this.node);
        for(var i=0; i<parameters.length;++i) {
            var parameter = parameters[i];
            var particleGroup = new SPE.Group({
                maxAge: 2,
                texture: Core.assetsLoader.get('textures', 'smokeparticle')
            });
            var power = parameter.power || 50;
            var color = parameter.color || new THREE.Color('yellow');
            particleGroup.addPool(1, {
                type: 'sphere',
                positionSpread: new THREE.Vector3(10, 10, 10),
                radius: 0.25,
                speed: power * 0.1,
                sizeStart: 1,
                sizeStartSpread: power * 0.25,
                sizeEnd: 0,
                opacityStart: 1,
                opacityEnd: 0,
                colorStart: color,
                colorStartSpread: new THREE.Vector3(1, 1, 1),
                particleCount: power,
                alive: 0,
                duration: 0.05
            }, false);
            particleGroup.mesh.position.copy(parameter.position);
            this.node.add(particleGroup.mesh);
            this.explosions.push({
                group: particleGroup,
                parameter: parameter,
                exploded: false,
                finished: false
            });
            this.lifeTime = 0;
        }
    }

    Explosion.prototype.update = function(Core, delta) {
        this.lifeTime+= delta;
        var count = 0;
        for(var i=0;i<this.explosions.length;++i) {
            var data = this.explosions[i];
            if(data.finished) {
                continue;
            }
            ++count;
            if(! data.exploded) {
                var delay = data.parameter.delay || 0;
                console.log('not');
                if(delay <= this.lifeTime) {
                    console.log('explode !');
                    data.group.triggerPoolEmitter(1);
                    data.exploded = true;
                }
            }
            if(data.exploded) {
                data.group.tick(delta);
                if(data.group._pool.length > 0) {
                    data.finished = true;
                }
            }
        }
        var isDead = count == 0;
        if(isDead) {
            this.remove();
        }
        return isDead;
    };

    Explosion.prototype.remove = function() {
        this.node.parent.remove(this.node);
    };

    return Explosion;
});
