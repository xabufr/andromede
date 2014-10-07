require.config({
    baseUrl: "scripts",
    paths:{
        three: "../../bower_components/three.js/three",
        SPE: '../../bower_components/ShaderParticleEngine/build/ShaderParticles',
        Stats: '../../bower_components/stats.js/build/stats.min',
        SocketIO: '../../bower_components/socket.io-client/socket.io',
        Move: '../../bower_components/movejs/move.min',
        TWEEN: '../../bower_components/tweenjs/build/tween.min',
        'three.targetcamera': '../../bower_components/THREE.TargetCamera/build/THREE.TargetCamera.min',
        PreloadJS: '../../bower_components/PreloadJS/lib/preloadjs-0.4.1.min'
    },
    shim: {
        three: {
            exports: "THREE"
        },
        SPE: {
            exports: 'SPE'
        },
        Stats: {
            exports: 'Stats'
        },
        Move: {
            exports: 'move'
        },
        TWEEN: {
            exports: 'TWEEN'
        },
        'three.targetcamera': {
            exports: 'THREE.TargetCamera',
            deps: ['three']
        },
        PreloadJS: {
            exports: 'createjs'
        }
    }
});

require(['main']);
