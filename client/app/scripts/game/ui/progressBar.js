define([], function() {
    "use strict";
    function ProgressBar(elementId) {
        this.element = document.getElementById(elementId);
        this.element.style.display = 'inline-block';
        this.setPosition({x: 0, y: 0});
        this.value = this.element.value = 1;
    }
    ProgressBar.prototype.setValue = function(value) {
        if(value != this.value) {
            this.value = this.element.value = value;
        }
    };

    ProgressBar.prototype.setPosition = function(position) {
        this.element.style.right = position.x + 'px';
        this.element.style.bottom = position.y + 'px';
    };
    return ProgressBar;
});
