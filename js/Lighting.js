define(function(){
    'use strict';

    function buildFillLighting(){
        var light = new THREE.DirectionalLight(0x112211);

        light.position.set(-522,400,81);

        return light;
    }

    function buildHemilight(){
        var light = new THREE.HemisphereLight(0xa5c9e9, 0x78ab46, 0.4);

        light.position.set(0, 1, 0);

        return light;
    }

    function buildSpotlight(x, z, colour){
        var light = new THREE.DirectionalLight();

        light.castShadow = true;
        light.shadowMapWidth = 2048;
        light.shadowMapHeight = 2048;
        light.shadowDarkness = 0.4;

        light.position.x = x;
        light.position.z = z;
        light.color = new THREE.Color(colour);

        return light;
    }

    function requiredOptions(options){
        ['resolution', 'spotlightX', 'spotlightZ', 'spotlightColour'].forEach(function(key){
            if(!options[key]){
                throw new Error(key + ' is required');
            }
        });
    }

    function Lighting(options){
        requiredOptions(options || {});

        this.resolution = options.resolution;
        this.spotlight = buildSpotlight(options.spotlightX, options.spotlightZ, options.spotlightColour);
        this.hemilight = buildHemilight();
        this.filllight = buildFillLighting();

        this.targetY = 0;
        this.accelY = 0;
    }

    Lighting.prototype.onAudioTick = function onAudioTick(frequencyArray){
        var sumY = 0;
        for(var i = 0; i < this.resolution; i++){
            sumY += frequencyArray[i] / 4;
        }
        this.targetY = (sumY / 3) - 200;
        this.moveSpotlight();
        this.hemilight.intensity = 0.4 + (this.spotlight.position.y / 1000);
    };

    Lighting.prototype.moveSpotlight = function moveSpotlight(){
        var delta = this.targetY - this.spotlight.position.y;
        var accelChange = delta / 100;
        this.accelY += accelChange;
        this.accelY *= 0.95;
        this.spotlight.position.y += this.accelY;

        if(this.spotlight.position.y < 1){
            this.spotlight.position.y = 1;
        }
    };

    Lighting.prototype.getLighting = function getLighting(){
        var group = new THREE.Group();
        group.add(this.spotlight);
        group.add(this.hemilight);
        group.add(this.filllight);
        return group;
    };

    return Lighting;

});
