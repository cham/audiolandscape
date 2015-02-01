define(function(){
    'use strict';

    return function datControls(){
        // var gui = new dat.GUI();
        var config = {
            'spotlight': 0xa08f65,//a47400,//xE9C2A6,
            'spotlightX': -52,
            'spotlightY': 257,
            'spotlightZ': 900,
            'systemX': -390,
            'systemZ': 115,
            'fogColour': 0xfff5ac
        };

        // var f0 = gui.addFolder('Fog');
        // f0.addColor(config, 'fogColour');

        // var f1 = gui.addFolder('Position');
        // f1.add(config, 'systemX', -3000, 3000);
        // f1.add(config, 'systemZ', -3000, 3000);

        // var f2 = gui.addFolder('Lighting');
        // f2.addColor(config, 'spotlight');
        // f2.add(config, 'spotlightX', -1000, 1000);
        // f2.add(config, 'spotlightY', -1000, 1000);
        // f2.add(config, 'spotlightZ', -1000, 1000);

        // gui.close();

        return config;
    };

});
