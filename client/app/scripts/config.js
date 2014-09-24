require.config({
    baseUrl: "scripts",
    paths:{
        "three": "../../bower_components/three.js/three",
        "Howler": "../../bower_components/howler.js/howler"
    },
    shim: {
        "three": {
            exports: "THREE"
        }
    }
});

require(['main']);
