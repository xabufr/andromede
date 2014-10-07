define(['three', 'PreloadJS', './assetsList'], function (THREE, createjs, assetsList){
    'use strict';

    function SoundPlugin() {
    }
    var s = SoundPlugin;
    s.getPreloadHandlers = function() {
        return {
            callback: s.preloadHandler, // Proxy the method to maintain scope
            types: ["sound"],
            extensions: ["mp3", "ogg"]
        }
    };
    s.preloadHandler = function(src, type, id, data, basePath, queue) {
        return {
            tag: {
                load: function() {
                    var request = new XMLHttpRequest();
                    request.open('GET', src, true);
                    request.responseType = 'arraybuffer';
                    var that = this;
                    request.onload = function() {
                        that.result = this.response;
                        that.onload();
                    };
                    request.onerror = this.onerror;
                    request.send();
                },
                onload: null,
                onerror: null,
                result: null,
                data: data
            }
        }
    };

    function AssetsLoader(){
        this.assets = {};
        this.loader = new THREE.JSONLoader();
        this.completeCallback = null;
        this.progressCallback = null;
        var queue = new createjs.LoadQueue(true);
        queue.installPlugin(SoundPlugin);

        queue.on("fileload", handleFileLoad, this);
        queue.on("complete", handleComplete, this);
        queue.on("progress", handleProgress, this);

        function handleFileLoad(event) {
            var itemData = event.item.data;
            var resultStore = this.assets[itemData.categoryName] = this.assets[itemData.categoryName]||{};
            var resultProcessed = event.result;
            if(itemData.category.interpreter) {
                resultProcessed = itemData.category.interpreter(resultProcessed, event.item.src);
            }
            if(itemData.array === true) {
                resultStore[itemData.key] = resultStore[itemData.key] || [];
                resultStore[itemData.key][itemData.index] = resultProcessed;
            } else {
                resultStore[itemData.key] = resultProcessed;
            }
        }

        function handleComplete(event) {
            console.log(this.assets);
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
                    var assetSrc = list[assetKey];
                    var assetDefinition;
                    if(typeof assetSrc === 'object') {
                        loadArrayAssets(categoryName, category, assetKey, assetSrc);
                    } else {
                        assetDefinition = {id: categoryName + '.' + assetKey, src: assetSrc, data: {
                            category: category,
                            categoryName: categoryName,
                            key: assetKey
                        }};
                        if(category.type) {
                            assetDefinition.type = category.type;
                        }
                        queue.loadFile(assetDefinition);
                    }
                }
            }
            categories.forEach(loadCategory);
        };
        function loadArrayAssets(categoryName, category, assetKey, assetsSrc) {
            for(var i=0;i<assetsSrc.length;++i) {
                var a = {src: assetsSrc[i], data: {
                    category: category,
                    categoryName: categoryName,
                    key: assetKey,
                    array: true,
                    index: i
                }};
                queue.loadFile(a);
            }
        }

        this.get = function(category, key) {
            return this.assets[category][key];
        };
    }

    return AssetsLoader;
});