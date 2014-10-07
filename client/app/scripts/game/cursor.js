define([], function (){
    'use strict';
   return function Cursor () {
        this.sprite = document.getElementById("cursor");
        this.move = function(core) {
            var input = core.input;
            this.sprite.style.left = (input.mouse.abs.x - (32 / 2))+'px';
            this.sprite.style.top = (input.mouse.abs.y - (32 / 2))+'px';
        }.bind(this);
   };
});