define(['three', './soundengine'], function(THREE, SoundEngine){
    'use strict';
    var loader = new THREE.JSONLoader();
    return {
        models: {
            list: {
                spaceShip: "assets/models/spaceShip.js",
                mainWeapon: "assets/models/weapon.js"
            },
            type: 'json',
            interpreter: function(data, url) {
                return loader.parse(data, loader.extractUrlBase(url));
            }
        }, textures: {
            list: {
                spacebox: ['assets/textures/spacebox/right1.png',
                    'assets/textures/spacebox/left2.png',
                    'assets/textures/spacebox/top3.png',
                    'assets/textures/spacebox/bottom4.png',
                    'assets/textures/spacebox/front5.png',
                    'assets/textures/spacebox/back6.png'],
                smokeparticle: 'assets/textures/smokeparticle.png',
                lensflare0: 'assets/textures/sun/lensflare0.png',
                lensflare2: 'assets/textures/sun/lensflare2.png',
                lensflare3: 'assets/textures/sun/lensflare3.png'
            },
            interpreter: function(data) {
                var texture = new THREE.Texture(undefined, undefined);
                texture.image = data;
                texture.needsUpdate = true;
                return texture;
            }
        }, sounds: {
            list: {
                shot: 'assets/sound/laser.mp3'
            },
            type: 'sound',
            interpreter: function(data) {
                SoundEngine.register(data);
                return null;
            }
        }
    }
});