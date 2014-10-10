define([], function() {
    "use strict";
    function SpaceShipInfos(ship) {
        this.ship = ship;
        this.onScreenElement = document.createElement('progress');
        document.body.appendChild(this.onScreenElement);
        this.onScreenElement.style.position = 'absolute';
        this.onScreenElement.style.display = 'none';
    }
    SpaceShipInfos.prototype.setPositionOnScreen = function(position, isOnScreen) {
        console.log(position);
        if(isOnScreen) {
            this.onScreenElement.style.display = 'block';
            this.onScreenElement.style.bottom = position.y + 'px';
            this.onScreenElement.style.left = position.x + 'px';
            this.onScreenElement.value = this.ship.lifePercent();
        } else {
            this.onScreenElement.style.display = 'none';
        }
    };
    return SpaceShipInfos;
});
