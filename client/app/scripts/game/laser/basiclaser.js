define(['three'], function(THREE) {
    'use strict';
    var canvas = generateLaserBodyCanvas();
    var texture = new THREE.Texture(canvas);
    var geometry = new THREE.PlaneGeometry(1, 0.1);
    var nPlanes = 8;
    var count = 0;
    texture.needsUpdate = true;

    return function() {
        this.material = new THREE.MeshBasicMaterial({
            map	: texture,
            blending	: THREE.AdditiveBlending,
            color	: 0x4444aa,
            side	: THREE.DoubleSide,
            depthWrite	: false,
            transparent	: true
        });
        this.resetMaterialColor = function() {
            this.material.color = new THREE.Color(0x4444aa);
        };
        var object3d = new THREE.Object3D();
        object3d.name = 'laser'+count++;
        this.mesh = object3d;

        for(var i=0; i < nPlanes; ++i) {
            var mesh = new THREE.Mesh(geometry, this.material);
            mesh.position.x = 0.5;
            mesh.rotation.x = (i / nPlanes) * Math.PI;
            object3d.add(mesh);
        }
    };


    function generateLaserBodyCanvas(){
// init canvas
        var canvas	= document.createElement( 'canvas' );
        var context	= canvas.getContext( '2d' );
        canvas.width	= 1;
        canvas.height	= 64;
// set grd
        var grd	= context.createLinearGradient(0, 0, canvas.width, canvas.height);
        grd.addColorStop( 0 , 'rgba( 0, 0, 0,0.1)' );
        grd.addColorStop( 0.1, 'rgba(160,160,160,0.3)' );
        grd.addColorStop( 0.5, 'rgba(255,255,255,0.5)' );
        grd.addColorStop( 0.9, 'rgba(160,160,160,0.3)' );
        grd.addColorStop( 1.0, 'rgba( 0, 0, 0,0.1)' );
// fill the rectangle
        context.fillStyle	= grd;
        context.fillRect(0,0, canvas.width, canvas.height);
// return the just built canvas
        return canvas;
    }
});
