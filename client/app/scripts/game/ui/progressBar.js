define([], function() {
    "use strict";
    function ProgressBar() {
        this.element = document.getElementById('life');
        this.element.style.display = 'inline-block';
        this.element.style.bottom = '0px';
        this.element.style.right = '0px';
        this.value = this.element.value = 1;
    }
    ProgressBar.prototype.setValue = function(value) {
        if(value != this.value) {
            this.value = this.element.value = value;
        }
    };
    return ProgressBar;
});
