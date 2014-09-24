define([], function() {
    return function (objectType, poolSize, core) {
        var freeObjects = [];
        var occupedObjects = [];

        function allocate(size) {
            for (var i = 0; i < size; ++i) {
                freeObjects.push(new objectType(core));
            }
        }
        allocate(poolSize);
        var update = function() {
            var occ = [];
            for(var i=0; i<occupedObjects.length;++i) {
                var obj = occupedObjects[i];
                if(obj.isFree() === true) {
                    freeObjects.push(obj);
                } else {
                    occ.push(obj);
                }
            }
            occupedObjects = occ;
        };

        function getFirstFree() {
            var obj = freeObjects[0];
            freeObjects = freeObjects.slice(1);
            occupedObjects.push(obj);
            return obj;
        }

        this.get = function() {
            if(freeObjects.length > 0) {
                return getFirstFree();
            }
            else {
                update();
                if(freeObjects.length == 0) {
                    allocate(poolSize);
                }
                return getFirstFree();
            }
        }
    }
});
