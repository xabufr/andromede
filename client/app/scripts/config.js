require.config({
    baseUrl: "scripts",
    paths:{
        three: "../../bower_components/three.js/three",
        Howler: "../../bower_components/howler.js/howler",
        SPE: '../../bower_components/ShaderParticleEngine/build/ShaderParticles',
        Stats: '../../bower_components/stats.js/build/stats.min',
        SocketIO: '../../bower_components/socket.io-client/socket.io',
        Move: '../../bower_components/movejs/move.min'
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
        }
    }
});

require(['main']);
