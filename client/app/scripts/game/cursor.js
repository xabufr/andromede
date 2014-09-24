define([], function (){
   return function Cursor () {
        var that = this;
        this.sprite = document.getElementById("cursor");
        this.move = function(render) {
            var input = render.input;
            that.sprite.style.left = (input.mouse.abs.x - (32 / 2))+'px';
            that.sprite.style.top = (input.mouse.abs.y - (32 / 2))+'px';
     }
   };
});