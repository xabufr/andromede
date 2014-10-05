define(['three'], function(THREE){
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

            }
        }, sounds: {
            list: {
                shot: 'assets/sound/laser.mp3'
            }
        }
    }
});