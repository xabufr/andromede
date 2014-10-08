define(['three', './glitchshader'], function(THREE, GlitchShader) {
    "use strict";
    var GlitchEffect = function ( dt_size ) {
        var shader = GlitchShader;
        this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

        if(dt_size==undefined) dt_size=64;

        this.uniforms[ "tDisp"].value=this.generateHeightmap(dt_size);
        this.uniforms[ 'byp' ].value=0;

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader
        });

        this.enabled = false;
        this.needsSwap = true;

        this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
        this.scene  = new THREE.Scene();

        this.quad = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), null );
        this.scene.add( this.quad );

        this.curF = this.randX = 0;

    };

    GlitchEffect.prototype = {
        render: function ( renderer, writeBuffer, readBuffer, delta ) {
            this.uniforms[ "tDiffuse" ].value = readBuffer;
            this.uniforms[ 'seed' ].value=Math.random();

            if(this.curF++ >= this.randX) {
                this.enabled = false;
                this.curF = this.randX = 0;
            } else if(this.curF % this.randX <this.randX/5) {
                this.uniforms[ 'amount' ].value=Math.random()/90;
                this.uniforms[ 'angle' ].value=THREE.Math.randFloat(-Math.PI,Math.PI);
                this.uniforms[ 'distortion_x' ].value=THREE.Math.randFloat(0,1);
                this.uniforms[ 'distortion_y' ].value=THREE.Math.randFloat(0,1);
                this.uniforms[ 'seed_x' ].value=THREE.Math.randFloat(-0.3,0.3);
                this.uniforms[ 'seed_y' ].value=THREE.Math.randFloat(-0.3,0.3);
            }
            this.quad.material = this.material;
            renderer.render( this.scene, this.camera, writeBuffer, false );
        },
        generateHeightmap:function(dt_size) {
            var data_arr = new Float32Array( dt_size*dt_size * 3 );
            console.log(dt_size);
            var length=dt_size*dt_size;

            for ( var i = 0; i < length; i++) {
                var val=THREE.Math.randFloat(0,1);
                data_arr[ i*3 + 0 ] = val;
                data_arr[ i*3 + 1 ] = val;
                data_arr[ i*3 + 2 ] = val;
            }

            var texture = new THREE.DataTexture( data_arr, dt_size, dt_size, THREE.RGBFormat, THREE.FloatType );
            console.log(texture);
            console.log(dt_size);
            texture.minFilter = THREE.NearestFilter;
            texture.magFilter = THREE.NearestFilter;
            texture.needsUpdate = true;
            texture.flipY = false;
            return texture;
        },
        glitchDuring: function(frames) {
            this.randX += THREE.Math.randInt(frames - 10, frames + 10);
            this.uniforms[ 'amount' ].value=Math.random()/30;
            this.uniforms[ 'angle' ].value=THREE.Math.randFloat(-Math.PI,Math.PI);
            this.uniforms[ 'seed_x' ].value=THREE.Math.randFloat(-1,1);
            this.uniforms[ 'seed_y' ].value=THREE.Math.randFloat(-1,1);
            this.uniforms[ 'distortion_x' ].value=THREE.Math.randFloat(0,1);
            this.uniforms[ 'distortion_y' ].value=THREE.Math.randFloat(0,1);
            this.enabled = true;
        }
    };
    return GlitchEffect;
});