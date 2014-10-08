define(['three', './shaderpass', './copyshader'], function(THREE, ShaderPass, CopyShader) {
    "use strict";
    var EffectComposer = function (renderer, renderTarget) {
        this.renderer = renderer;

        if (renderTarget === undefined) {
            var width = window.innerWidth || 1;
            var height = window.innerHeight || 1;
            var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
            renderTarget = new THREE.WebGLRenderTarget(width, height, parameters);
        }
        this.renderTarget1 = renderTarget;
        this.renderTarget2 = renderTarget.clone();

        this.writeBuffer = this.renderTarget1;
        this.readBuffer = this.renderTarget2;
        this.passes = [];
        this.copyPass = new ShaderPass(CopyShader);
    };

    EffectComposer.prototype = {
        swapBuffers: function () {
            var tmp = this.readBuffer;
            this.readBuffer = this.writeBuffer;
            this.writeBuffer = tmp;
        },
        addPass: function (pass) {
            this.passes.push(pass);
        },
        insertPass: function (pass, index) {
            this.passes.splice(index, 0, pass);
        },
        render: function (delta) {
            this.writeBuffer = this.renderTarget1;
            this.readBuffer = this.renderTarget2;
            var maskActive = false;
            var pass, i, il = this.passes.length;
            for (i = 0; i < il; i++) {
                pass = this.passes[ i ];
                if (!pass.enabled) continue;
                pass.render(this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive);
                if (pass.needsSwap) {
                    if (maskActive) {
                        var context = this.renderer.context;
                        context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff);
                        this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, delta);
                        context.stencilFunc(context.EQUAL, 1, 0xffffffff);
                    }
                    this.swapBuffers();
                }
            }
            //Copy buffer to screen
            var toScreen = this.copyPass.renderToScreen;
            this.copyPass.renderToScreen = true;
            this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive);
            this.copyPass.renderToScreen = toScreen;

            this.renderer.clearTarget(this.readBuffer, new THREE.Color(0xffffff));
            this.renderer.clearTarget(this.writeBuffer, new THREE.Color(0xffffff));
        },
        reset: function (renderTarget) {
            if (renderTarget === undefined) {
                renderTarget = this.renderTarget1.clone();
                renderTarget.width = window.innerWidth;
                renderTarget.height = window.innerHeight;

            }
            this.renderTarget1 = renderTarget;
            this.renderTarget2 = renderTarget.clone();

            this.writeBuffer = this.renderTarget1;
            this.readBuffer = this.renderTarget2;
        },
        setSize: function (width, height) {
            var renderTarget = this.renderTarget1.clone();
            renderTarget.width = width;
            renderTarget.height = height;
            this.reset(renderTarget);
        }
    };
    return EffectComposer;
});
