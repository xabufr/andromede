define(['three'], function(THREE) {
    "use strict";
    var projector = new THREE.Projector();
    function ObjectInfos(id, object, element) {
        this.id = id;
        this.object = object;
        this.element = element;
        this.positionOnScreen = new THREE.Vector3();
        this.isOnScreen = false;
    }
    ObjectInfos.prototype.update = function(Core, delta) {
        projector.projectVector(this.positionOnScreen.copy(this.object.position), Core.camera.threeCamera);
        this.isOnScreen = (Math.abs(this.positionOnScreen.x) < 1 && Math.abs(this.positionOnScreen.y) < 1 && this.positionOnScreen.z < 1);
        if(!this.isOnScreen) {
            if(this.positionOnScreen.z >= 1) {
                this.positionOnScreen.multiplyScalar(-1);
                this.positionOnScreen = this.calculatePositionObjectBehind(this.positionOnScreen);
            }
            this.positionOnScreen.clampScalar(-1, 1);
        }
        this.positionOnScreen.multiplyScalar(0.5);
        this.positionOnScreen.addScalar(0.5);
        this.positionOnScreen.x *= window.innerWidth;
        this.positionOnScreen.y *= window.innerHeight;
        this.element.setPositionOnScreen(this.positionOnScreen, this.isOnScreen);
    };
    ObjectInfos.prototype.calculatePositionObjectBehind = function(position) {
        var x = Math.abs(position.x),
            y = Math.abs(position.y),
            scalar = 0;
        if(x < 1 && y < 1) {
            if(x > y) {
                scalar = 1 / x;
            } else {
                scalar = 1 / y;
            }
            return position.multiplyScalar(scalar);
        }
        return position;
    };

    ObjectInfos.prototype.remove = function() {
        this.element.remove();
    };
    return ObjectInfos;
});
