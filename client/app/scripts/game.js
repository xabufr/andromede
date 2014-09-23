define(['game/render', 'game/spacebox'], function(render, spacebox) {
    'use strict';
    render.scene.add(spacebox);

    return {
        start: function() {
            render.start();
        }
    }
});
