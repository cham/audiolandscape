define([
    'js/Landscape',
    'js/LandscapeInverted',
    'js/LandscapeDetails',
    'js/Lighting',
    'js/StaticDecoration',
    'js/Sandbox',
    'js/AudioData',
    'js/DragDropArrayBuffer',
    'js/LandscapeUI'
],function(
    Landscape,
    LandscapeInverted,
    LandscapeDetails,
    Lighting,
    StaticDecoration,
    Sandbox,
    AudioData,
    DragDropArrayBuffer,
    LandscapeUI
){
    'use strict';

    return function viz(config){

        function makeStats(){
            var stats = new Stats();

            stats.domElement.style.position = 'absolute';
            stats.domElement.style.top = 0;
            document.body.appendChild(stats.domElement);

            return stats;
        }

        var stats = makeStats();
        var resolution = 64;
        var numRows = 105;
        var waterLevel = 1;
        var useFog = config.useFog === false ? false : true;
        var systemX = -390;
        var systemZ = 115;

        var sandbox = new Sandbox();
        if(useFog){
            sandbox.scene.fog = new THREE.Fog(config.fogColour, 0, 800);
        }

        var cameraTargetY = 0;
        var cameraAccel = 0;
        var landscape;
        var landscapeOptions = {
            resolution: resolution,
            numRows: numRows,
            waterLevel: waterLevel,
            mountainLevel: config.mountainLevel || 50,
            unitsPerVertex: 6,
            colours: config.landColours,
            cameraXRange: 150 / 2,
            meshX: systemX,
            meshZ: systemZ,
            wireframeOverlay: config.wireframeOverlay
        };

        if(config.landscapeType === 'inverted'){
            landscape = new LandscapeInverted(landscapeOptions);
        }else{
            landscape = new Landscape(landscapeOptions);
        }

        var landscapeDetails = new LandscapeDetails({
            resolution: resolution,
            numRows: numRows,
            waterLevel: waterLevel,
            offsetX: systemX,
            offsetZ: systemZ,
            type: config.detailType
        });

        var lighting = new Lighting({
            resolution: resolution,
            spotlightX: -52,
            spotlightZ: 900,
            spotlightColour: config.spotlightColour
        });

        var staticDecoration = new StaticDecoration({
            waterLevel: waterLevel,
            waterColour: config.waterColour,
            skyMap: config.skyMap
        });

        function moveCamera(){
            var delta = cameraTargetY - sandbox.camera.position.y;
            var accelChange = delta / 100;

            cameraAccel += accelChange;
            cameraAccel *= 0.9;
            sandbox.camera.position.y += cameraAccel;
            if(sandbox.camera.position.y < 6){
                sandbox.camera.position.y = 6;
            }
        }

        var audio = new AudioData({
            bufferWidth: resolution,
            onTick: function(freqArray){
                landscape.onAudioTick(freqArray);
                lighting.onAudioTick(freqArray);
                if(config.includeDetail){
                    landscapeDetails.onTick(sandbox, landscape.geometry, stats.getFPS() > 30);
                }

                cameraTargetY = landscape.getCameraTargetY(sandbox.camera.position.x) + config.cameraHeight;
            }
        });

        function tick(){
            requestAnimationFrame(tick);

            stats.begin();
            sandbox.render();

            moveCamera();

            if(useFog){
                sandbox.scene.fog.far = config.fogMinimumDistance + lighting.spotlight.position.y;
                sandbox.scene.fog.near = lighting.spotlight.position.y / 2;
            }

            stats.end();
        }

        sandbox.add(staticDecoration.getObjects());
        sandbox.add(landscape.mesh);
        sandbox.add(lighting.getLighting());

        var ui = new LandscapeUI();
        ui.onDragAudio(function(arrayBuffer){
            audio.onLoadAudio(arrayBuffer);
        });
        ui.onPlayDefault(function(){
            audio.loadUrl(config.mp3Url);
        });

        sandbox.appendTo(document.body);
        document.body.appendChild(ui.domNode);

        requestAnimationFrame(tick);

    };

});
