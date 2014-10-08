define([], function (){
    'use strict';
   return function Cursor () {
        this.sprite = document.getElementById("cursor");
        this.color = 'green';
        this.textures = {
            'red': 'assets/textures/cursorRed.png',
            'green': 'assets/textures/cursorGreen.png'
        };
        this.move = function(core) {
            var input = core.input;
            this.sprite.style.left = (input.mouse.abs.x - (32 / 2))+'px';
            this.sprite.style.top = (input.mouse.abs.y - (32 / 2))+'px';
        }.bind(this);

        this.changeColor = function(color) {
            color = (color === 'green')?'green':'red';
            if(color != this.color) {
                this.color = color;
                this.sprite.style.backgroundImage = 'url('+this.textures[this.color]+')';
            }
        }
   };
});