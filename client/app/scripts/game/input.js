define([], function() {
    'use strict';
    return {
        mouse: {
            rel: {
                x: 0,
                y: 0
            },
            abs: {
                x: window.innerWidth * 0.5,
                y: window.innerHeight * 0.5,
                set: function(x, y) {
                    if(x > 0 && x <= window.innerWidth) {
                        this.x = x;
                    }
                    if(y > 0 && y <= window.innerHeight) {
                        this.y = y;
                    }
                },
                increment: function(x, y) {
                    this.set(this.x + x, this.y + y);
                }
            }
        },
        setup: function(element) {
            var that = this;
            var havePointerLock = 'pointerLockElement' in document ||
                'mozPointerLockElement' in document ||
                'webkitPointerLockElement' in document;
            var lock = function() {
                element.requestPointerLock();
            };
            var moveCallback = function (event) {
                var movementX = event.movementX ||
                        event.mozMovementX          ||
                        event.webkitMovementX       ||
                        0,
                    movementY = event.movementY ||
                        event.mozMovementY      ||
                        event.webkitMovementY   ||
                        0;
                that.mouse.rel.x = movementX;
                that.mouse.rel.y = movementY;
                that.mouse.abs.increment(movementX, movementY);
            };
            var lockChangeCallback = function() {
                if (document.pointerLockElement === element ||
                    document.mozPointerLockElement === element ||
                    document.webkitPointerLockElement === element) {
                    document.addEventListener("mousemove", moveCallback, false);
                } else {
                    document.removeEventListener("mousemove", moveCallback, false);
                }
            };
            if(havePointerLock) {
                element.requestPointerLock = element.requestPointerLock ||
                    element.mozRequestPointerLock ||
                    element.webkitRequestPointerLock;
                document.exitPointerLock = document.exitPointerLock ||
                    document.mozExitPointerLock ||
                    document.webkitExitPointerLock;
                document.addEventListener('pointerlockchange', lockChangeCallback, false);
                document.addEventListener('mozpointerlockchange', lockChangeCallback, false);
                document.addEventListener('webkitpointerlockchange', lockChangeCallback, false);

                element.addEventListener('click', lock, false);
            } else {
                console.log('Cannot lock mouse');
                throw 'Cannot lock mouse';
            }
        }
    }
});
