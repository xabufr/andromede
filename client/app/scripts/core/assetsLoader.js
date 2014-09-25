define(['three', './../game/assetsList'], function (THREE, assetsList){
    'use strict';

    return function AssetsLoader(){
        this.meshesList = {};
        this.loader = new THREE.JSONLoader();
        this.loadMeshes = function(callback) {
            var nbrAssets = Object.keys(assetsList).length;
            var loadedAssets = 0;

            for (var key in assetsList) {
                var path = assetsList[key];
                this.loader.load(path, function(currentKey) {
                    return function(geometry, materials){
                        this.meshesList[currentKey] = {
                            geometry: geometry,
                            materials: materials
                        };

                        if (++loadedAssets === nbrAssets) {
                            callback();
                        }
                    }.bind(this);
                }.bind(this)(key));
            }
        };

        this.get = function(key) {
            return this.meshesList[key];
        };
    }
})