define([], function() {
    "use strict";
    function LockedTarget() {
        this.element = document.body.appendChild(document.createElement('img'));
        this.element.src = 'assets/textures/cursorRed.png';
        this.element.style.display = 'block';
        this.element.style.position = 'absolute';
    }
    LockedTarget.prototype.setPositionOnScreen = function(position, isOnScreen) {
        if(!isOnScreen) {
            this.keepOnScreen(position, 32, 32);
        }

        this.element.style.bottom = position.y + 'px';
        this.element.style.left = position.x + 'px';
    };

    LockedTarget.prototype.keepOnScreen = function(position, width, heigth) {
        var windowWidth = window.innerWidth,
            windowHeigth = window.innerHeight;
        position.x = Math.min(position.x, windowWidth - width);
        position.y = Math.min(position.y, windowHeigth - heigth);
        return position;
    };

    LockedTarget.prototype.remove = function() {
        document.body.removeChild(this.element);
    };

    return LockedTarget;
});
