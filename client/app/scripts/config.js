require.config({
    baseUrl: "scripts",
    paths:{
        "three": "../../bower_components/three.js/three",
        "Howler": "../../bower_components/howler.js/howler",
        'SPE': '../../bower_components/ShaderParticleEngine/build/ShaderParticles'
    },
    shim: {
        "three": {
            exports: "THREE"
        },
        'SPE': {
            exports: 'SPE'
        }
    }
});

require(['main']);
