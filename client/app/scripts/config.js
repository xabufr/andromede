require.config({
    baseUrl: "scripts",
    paths:{
        "three": "../../bower_components/three.js/three"
    },
    shim: {
        "three": {
            exports: "THREE"
        }
    }
});

require(['main']);
