define([], function() {
    'use strict';
    (function(window,document) {

        var prefix = "", _addEventListener, onwheel, support;

        // detect event model
        if ( window.addEventListener ) {
            _addEventListener = "addEventListener";
        } else {
            _addEventListener = "attachEvent";
            prefix = "on";
        }

        // detect available wheel event
        support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
                document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
            "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

        window.addWheelListener = function( elem, callback, useCapture ) {
            _addWheelListener( elem, support, callback, useCapture );

            // handle MozMousePixelScroll in older Firefox
            if( support == "DOMMouseScroll" ) {
                _addWheelListener( elem, "MozMousePixelScroll", callback, useCapture );
            }
        };

        function _addWheelListener( elem, eventName, callback, useCapture ) {
            elem[ _addEventListener ]( prefix + eventName, support == "wheel" ? callback : function( originalEvent ) {
                !originalEvent && ( originalEvent = window.event );

                // create a normalized event object
                var event = {
                    // keep a ref to the original event object
                    originalEvent: originalEvent,
                    target: originalEvent.target || originalEvent.srcElement,
                    type: "wheel",
                    deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
                    deltaX: 0,
                    deltaZ: 0,
                    preventDefault: function() {
                        originalEvent.preventDefault ?
                            originalEvent.preventDefault() :
                            originalEvent.returnValue = false;
                    }
                };

                // calculate deltaY (and deltaX) according to the event
                if ( support == "mousewheel" ) {
                    event.deltaY = - 1/40 * originalEvent.wheelDelta;
                    // Webkit also support wheelDeltaX
                    originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );
                } else {
                    event.deltaY = originalEvent.detail;
                }

                // it's time to fire the callback
                return callback( event );

            }, useCapture || false );
        }

    })(window,document);

    return {
        mouse: {
            rel: {
                x: 0,
                y: 0,
                z: 0
            },
            abs: {
                x: window.innerWidth * 0.5,
                y: window.innerHeight * 0.5,
                z: 0,
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
                },
                incrementWheel: function(z) {
                    this.z = z;
                }
            },
            move: false,
            buttons: {
                right: false,
                left: false
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
                that.mouse.move = true;
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
            var mouseDown = function(e) {
                e.preventDefault();
                if(e.button == 2) {
                    that.mouse.buttons.right = true;
                } else if(e.button == 0) {
                    that.mouse.buttons.left = true;
                }
            };
            var mouseUp = function(e) {
                e.preventDefault();
                if(e.button == 2) {
                    that.mouse.buttons.right = false;
                } else if(e.button == 0) {
                    that.mouse.buttons.left = false;
                }
            };
            var mouseWheel = function(e) {
                this.mouse.abs.incrementWheel(e.deltaY);
                this.mouse.rel.z = e.deltaY;
            }.bind(this);
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
                element.addEventListener('mousedown', mouseDown, false);
                element.addEventListener('mouseup', mouseUp, false);
                window.addWheelListener(element, mouseWheel, false);
            } else {
                console.log('Cannot lock mouse');
                throw 'Cannot lock mouse';
            }
        },
        reset: function() {
            this.mouse.move = false;
            this.mouse.rel.x = this.mouse.rel.y = this.mouse.rel.z = 0;
        }
    }
});
