define(['three', './assetsList'], function (THREE, assetsList){
    'use strict';

    return function AssetsLoader(){
        this.meshesList = {};
        this.loader = new THREE.JSONLoader();
        this.loadMeshes = function(callback) {
            var that = this;
            var nbrAssets = Object.keys(assetsList).length;
            var loadedAssets = 0;

            for (var key in assetsList) {
                var path = assetsList[key];
                this.loader.load(path, function(currentKey) {
                    return function(geometry, materials){
                        that.meshesList[currentKey] = {
                            geometry: geometry,
                            materials: materials
                        };

                        if (++loadedAssets === nbrAssets) {
                            callback();
                        }
                    }
                }(key));
            }
        };

        this.get = function(key) {
            return this.meshesList[key];
        };
    }
})