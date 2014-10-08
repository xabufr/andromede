define([], function (){
    'use strict';
   return function Cursor () {
        this.sprite = document.getElementById("cursor");
        this.color = 'green';
        this.textures = {
            'red': 'assets/textures/cursorRed.png',
            'green': 'assets/textures/cursorGreen.png'
        }
        this.move = function(core) {
            var input = core.input;
            this.sprite.style.left = (input.mouse.abs.x - (32 / 2))+'px';
            this.sprite.style.top = (input.mouse.abs.y - (32 / 2))+'px';
        }.bind(this);

        this.changeColor = function() {
            var element = document.getElementById('cursor');
            this.color = (this.color === 'green')?'red':'green';
            element.setAttribute('href', this.textures[this.color]);
        }
   };
});