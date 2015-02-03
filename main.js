require([
    'js/Landscape',
    'js/Lighting',
    'js/StaticDecoration',
    'js/controls',
    'js/Sandbox',
    'js/AudioData',
    'js/DragDropArrayBuffer',
    'js/LandscapeUI'
],function(
    Landscape,
    Lighting,
    StaticDecoration,
    datControls,
    Sandbox,
    AudioData,
    DragDropArrayBuffer,
    LandscapeUI
){
    'use strict';

    function makeStats(){
        var stats = new Stats();

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = 0;
        document.body.appendChild(stats.domElement);

        return stats;
    }

    var stats = makeStats();
    var resolution = 64;
    var waterLevel = 1;
    var controls = datControls();

    var sandbox = new Sandbox();
    sandbox.scene.fog = new THREE.Fog(controls.fogColour, 0, 800);

    var cameraTargetY = 0;
    var cameraAccel = 0;

    var landscape = new Landscape({
        resolution: resolution,
        numRows: 105,
        waterLevel: waterLevel,
        unitsPerVertex: 6,
        colours: [0x339900, 0x72B84F, 0xCCE5BF, 0xE5F2DF, 0xF2F8EF, 0xFFFFFF],
        cameraXRange: 150 / 2,
        meshX: controls.systemX,
        meshZ: controls.systemZ
    });

    var lighting = new Lighting({
        resolution: resolution,
        spotlightX: controls.spotlightX,
        spotlightZ: controls.spotlightZ,
        spotlightColour: controls.spotlight
    });

    var staticDecoration = new StaticDecoration({
        waterLevel: waterLevel
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
            cameraTargetY = landscape.getCameraTargetY(sandbox.camera.position.x);
        }
    });

    function tick(){
        requestAnimationFrame(tick);

        stats.begin();
        sandbox.render();

        moveCamera();

        sandbox.scene.fog.far = 600 + lighting.spotlight.position.y;
        sandbox.scene.fog.near = lighting.spotlight.position.y / 2;

        stats.end();
    }

    sandbox.add(staticDecoration.getObjects());
    sandbox.add(landscape.getMesh());
    sandbox.add(lighting.getLighting());

    var ui = new LandscapeUI();
    ui.onDragAudio(function(arrayBuffer){
        audio.onLoadAudio(arrayBuffer);
    });
    ui.onPlayDefault(function(){
        audio.loadUrl('mp3/morning-mood-grieg.mp3');
    });

    sandbox.appendTo(document.body);
    document.body.appendChild(ui.domNode);

    requestAnimationFrame(tick);
});
