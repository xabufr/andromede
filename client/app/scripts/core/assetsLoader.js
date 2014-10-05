define(['three', 'PreloadJS', './assetsList'], function (THREE, createjs, assetsList){
    'use strict';

    function AssetsLoader(){
        this.assets = {};
        this.loader = new THREE.JSONLoader();
        this.completeCallback = null;
        this.progressCallback = null;
        var queue = new createjs.LoadQueue(false);
        queue.installPlugin(createjs.JAVASCRIPT);
        queue.installPlugin(createjs.IMAGE);
        queue.installPlugin(createjs.SOUND);

        queue.on("fileload", handleFileLoad, this);
        queue.on("complete", handleComplete, this);
        queue.on("progress", handleProgress, this);

        function handleFileLoad(event) {
            var itemData = event.item.data;
            var resultStore = this.assets[itemData.name] = this.assets[itemData.name]||{};
            var resultProcessed = event.result;
            if(itemData.category.interpreter) {
                resultProcessed = itemData.category.interpreter(resultProcessed, event.item.src);
            }
            resultStore[itemData.key] = resultProcessed;
        }

        function handleComplete(event) {
            if(this.completeCallback) {
                this.completeCallback();
            }
        }

        function handleProgress(event) {
            if(this.progressCallback) {
                this.progressCallback(event);
            }
        }

        this.startLoad = function() {
            var categories = Object.keys(assetsList);
            function loadCategory(categoryName) {
                var category = assetsList[categoryName];
                var list = category.list;
                var assets = Object.keys(list);
                for(var i=0;i<assets.length;++i) {
                    var assetKey = assets[i];
                    var a = {id: categoryName + '.' + assetKey, src: list[assetKey], data: {
                        category: category,
                        name: categoryName,
                        key: assetKey
                    }};
                    if(category.type) {
                        a.type = category.type;
                    }
                    queue.loadFile(a);
                }
            }
            categories.forEach(loadCategory);
        };

        this.get = function(category, key) {
            return this.assets[category][key];
        };
    }

    return AssetsLoader;
});