define(['three'], function (THREE){
   return function Cursor () {
        this.sprite = document.getElementById("cursor");
        this.minDistance = 70;
        this.move = function(render) {
            var input = render.input;
            this.sprite.style.left = (input.mouse.abs.x - (32 / 2))+'px';
            this.sprite.style.top = (input.mouse.abs.y - (32 / 2))+'px';
        }.bind(this);

        this.isInNoneActionArea = function() {
            var cursorPosition = new THREE.Vector2(this.pixelToInt(this.sprite.style.left) + (32 / 2),
                this.pixelToInt(this.sprite.style.top) + (32 / 2));
            var centerPosition = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);
            var distance = cursorPosition.distanceTo(centerPosition);
            return distance >= -this.minDistance && distance <= this.minDistance;
        }.bind(this);

        this.pixelToInt = function(value) {
          return parseInt(value.slice(0, value.length-2));
        };
   };
});