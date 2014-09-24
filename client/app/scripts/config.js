require.config({
    baseUrl: "scripts",
    paths:{
        three: "../../bower_components/three.js/three",
        Howler: "../../bower_components/howler.js/howler",
        SPE: '../../bower_components/ShaderParticleEngine/build/ShaderParticles',
        Stats: '../../bower_components/stats.js/build/stats.min'
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
        }
    }
});

require(['main']);
