define([], function() {
    "use strict";
    function SpaceShipInfos(ship) {
        this.ship = ship;
        this.onScreenElement = document.createElement('progress');
        document.body.appendChild(this.onScreenElement);
        this.onScreenElement.style.position = 'absolute';
        this.onScreenElement.style.display = 'none';
        this.onScreenElement.className = 'life objectLife';
        this.outScreenElement = document.body.appendChild(document.createElement('img'));
        this.outScreenElement.src = 'assets/textures/cursorRed.png';
        this.outScreenElement.style.display = 'none';
        this.outScreenElement.style.position = 'absolute';
    }
    SpaceShipInfos.prototype.setPositionOnScreen = function(position, isOnScreen) {
        if(isOnScreen) {
            this.onScreenElement.style.display = 'block';
            this.outScreenElement.style.display = 'none';
            this.onScreenElement.style.bottom = position.y + 'px';
            this.onScreenElement.style.left = position.x + 'px';
            this.onScreenElement.value = this.ship.lifePercent();
        } else {
            this.keepOnScreen(position, 32, 32);
            this.onScreenElement.style.display = 'none';
            this.outScreenElement.style.display = 'block';
            this.outScreenElement.style.bottom = position.y + 'px';
            this.outScreenElement.style.left = position.x + 'px';
        }
    };

    SpaceShipInfos.prototype.keepOnScreen = function(position, width, heigth) {
        var windowWidth = window.innerWidth,
            windowHeigth = window.innerHeight;
        position.x = Math.min(position.x, windowWidth - width);
        position.y = Math.min(position.y, windowHeigth - heigth);
        return position;
    };

    SpaceShipInfos.prototype.remove = function() {
        document.body.removeChild(this.onScreenElement);
        document.body.removeChild(this.outScreenElement);
    };

    return SpaceShipInfos;
});
