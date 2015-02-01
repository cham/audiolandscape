define(function(){
    'use strict';

    return function datControls(){
        var gui = new dat.GUI();
        var config = {
            'spotlight': 0xa08f65,//a47400,//xE9C2A6,
            'spotlightX': -200,
            'spotlightY': 257,
            'spotlightZ': 900,
            'systemX': -316,
            'systemZ': 100,
            'fogColour': 0xe1dad1
        };

        var f0 = gui.addFolder('Fog');
        f0.addColor(config, 'fogColour');

        var f1 = gui.addFolder('Position');
        f1.add(config, 'systemX', -1000, 1000);
        f1.add(config, 'systemZ', -1000, 1000);

        var f2 = gui.addFolder('Lighting');
        f2.addColor(config, 'spotlight');
        f2.add(config, 'spotlightX', -1000, 1000);
        f2.add(config, 'spotlightY', -1000, 1000);
        f2.add(config, 'spotlightZ', -1000, 1000);

        gui.close();

        return config;
    };

});
