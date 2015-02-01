require([
    'js/controls',
    'js/Sandbox',
    'js/AudioData',
    'js/DragDropArrayBuffer',
    'js/LandscapeUI'
],function(
    datControls,
    Sandbox,
    AudioData,
    DragDropArrayBuffer,
    LandscapeUI
){
    'use strict';

    var totalRows = 105;
    var resolution = 64;
    var horizontalUnitsPerVertex = 6;
    var controls = datControls();

    var sandbox = new Sandbox();
    var geometry = new THREE.Geometry();
    var material = new THREE.MeshLambertMaterial({
        vertexColors: THREE.VertexColors
    });
    var system = new THREE.Mesh(geometry, material);
    var cameraTargetY = 0;
    var cameraAccel = 0;
    var lightTargetY = 0;
    var lightAccel = 0;

    function makeStats(){
        var stats = new Stats();

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = 0;
        document.body.appendChild(stats.domElement);

        return stats;
    }

    var stats = makeStats();

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

    var heightColours = [0x339900, 0x72B84F, 0xCCE5BF, 0xE5F2DF, 0xF2F8EF, 0xFFFFFF];

    function colourVertices(){
        var aVertexY;
        var bVertexY;
        var cVertexY;
        var aIndex;
        var bIndex;
        var cIndex;

        for(var k = 0; k < geometry.faces.length; k++){
            aVertexY = geometry.vertices[geometry.faces[k].a].y;
            bVertexY = geometry.vertices[geometry.faces[k].b].y;
            cVertexY = geometry.vertices[geometry.faces[k].c].y;

            if(aVertexY > 50 || bVertexY > 50 || cVertexY > 50){
                aIndex = Math.floor((aVertexY - 50) / 2);
                bIndex = Math.floor((bVertexY - 50) / 2);
                cIndex = Math.floor((cVertexY - 50) / 2);
                if(aIndex < 0){ aIndex = 0; }
                if(bIndex < 0){ bIndex = 0; }
                if(cIndex < 0){ cIndex = 0; }
                if(aIndex > 5){ aIndex = 5; }
                if(bIndex > 5){ bIndex = 5; }
                if(cIndex > 5){ cIndex = 5; }
                geometry.faces[k].vertexColors[0] = new THREE.Color(heightColours[aIndex]);
                geometry.faces[k].vertexColors[1] = new THREE.Color(heightColours[bIndex]);
                geometry.faces[k].vertexColors[2] = new THREE.Color(heightColours[cIndex]);
            }else{
                if(aVertexY > 5 && aVertexY < 6){
                    geometry.faces[k].vertexColors[0] = new THREE.Color(0xEFDD6F);
                    geometry.faces[k].resetSandA = true;
                }else if(aVertexY > 6 && geometry.faces[k].resetSandA){
                    geometry.faces[k].vertexColors[0] = new THREE.Color(0x339900);
                    geometry.faces[k].resetSandA = false;
                }
                if(bVertexY > 5 && bVertexY < 6){
                    geometry.faces[k].vertexColors[1] = new THREE.Color(0xEFDD6F);
                    geometry.faces[k].resetSandB = true;
                }else if(bVertexY > 6 && geometry.faces[k].resetSandB){
                    geometry.faces[k].vertexColors[1] = new THREE.Color(0x339900);
                    geometry.faces[k].resetSandB = false;
                }
                if(cVertexY > 5 && cVertexY < 6){
                    geometry.faces[k].vertexColors[2] = new THREE.Color(0xEFDD6F);
                    geometry.faces[k].resetSandC = true;
                }else if(cVertexY > 6 && geometry.faces[k].resetSandC){
                    geometry.faces[k].vertexColors[2] = new THREE.Color(0x339900);
                    geometry.faces[k].resetSandC = false;
                }
            }
        }
        geometry.colorsNeedUpdate = true;
    }

    function skySphere(){
        var texture = THREE.ImageUtils.loadTexture('img/sky.jpg');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);
        var geometry = new THREE.SphereGeometry(300, 32, 32);
        var material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide
        });
        var mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(0, 0, -150);

        return mesh;
    }

    function waterPlane(){
        var geometry = new THREE.PlaneGeometry(2000, 2000);
        var material = new THREE.MeshPhongMaterial({
            color: 0x40a4df
        });
        var mesh = new THREE.Mesh(geometry, material);

        mesh.rotation.x = -Math.PI / 2;
        mesh.position.y = 5;

        return mesh;
    }
    
    function hemilight(){
        var light = new THREE.HemisphereLight(0xa5c9e9, 0x78ab46, 0.4);

        light.position.set(0, 1, 0);

        return light;
    }

    function lighting(){
        var light = new THREE.DirectionalLight();

        light.castShadow = true;
        light.shadowMapWidth = 2048;
        light.shadowMapHeight = 2048;
        light.shadowDarkness = 0.4;

        return light;
    }

    function fillLighting(){
        var light = new THREE.DirectionalLight(0x112211);

        light.position.set(-522,400,81);

        return light;
    }

    function addFace(geometry, bottomLeftVertex, topRightVertex){
        geometry.faces.push(new THREE.Face3(bottomLeftVertex, bottomLeftVertex+1, topRightVertex));
        geometry.faces.push(new THREE.Face3(topRightVertex, topRightVertex-1, bottomLeftVertex));
    }

    function addFaces(geometry){
        var rowOffset;
        for(var i = 0; i < totalRows - 1; i++){
            for(var j = 0; j < resolution * 2 - 1; j++){
                rowOffset = i * resolution * 2;
                addFace(geometry, rowOffset + j, rowOffset + (resolution * 2) + j + 1);
            }
        }
    }

    function addRow(rowNum){
        for(var i = 0; i < resolution * 2; i++){
            geometry.vertices.push(new THREE.Vector3(i * horizontalUnitsPerVertex, 0, -rowNum * 5));
        }
    }

    for(var i = 0; i < totalRows; i++){
        addRow(i);
    }
    addFaces(geometry);
    geometry.mergeVertices();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    system.castShadow = true;
    system.receiveShadow = true;

    for(var k = 0; k < geometry.faces.length; k++){
        for(var l = 0; l < 3; l++){
            geometry.faces[k].vertexColors[l] = new THREE.Color(0x339900);
        }
    }

    var spotLight = lighting();
    var hemi = hemilight();

    var audio = new AudioData({
        bufferWidth: resolution,
        onTick: function(freqArray){
            var freqY;
            var sumY = 0;
            var faceVertexY;
            for(var i = 0; i < resolution; i++){
                freqY = freqArray[i] / 4;
                geometry.vertices[resolution+i].y = freqY;
                geometry.vertices[resolution-i].y = freqY;
                sumY += freqY;
            }
            for(var j = totalRows - 1; j > 0; j--){
                for(var k = 0; k < resolution * 2; k++){
                    var offset = j * resolution * 2;
                    var prevRow = (j-1) * resolution * 2;
                    geometry.vertices[offset + k].y = geometry.vertices[prevRow + k].y;
                }
            }

            colourVertices();
            geometry.verticesNeedUpdate = true;
            var maxCameraDistance = 150 / 2;
            var camPosToResolutionRatio = resolution / maxCameraDistance;
            var cameraVertexOffset = Math.floor((sandbox.camera.position.x * camPosToResolutionRatio) / horizontalUnitsPerVertex);
            var cameraTargetFarY = geometry.vertices[resolution + (resolution * 2 * (totalRows-30)) + cameraVertexOffset].y;
            var cameraTargetMidY = geometry.vertices[resolution + (resolution * 2 * (totalRows-20)) + cameraVertexOffset].y;
            var cameraTargetNearY = geometry.vertices[resolution + (resolution * 2 * (totalRows-10)) + cameraVertexOffset].y;
            cameraTargetY = Math.max(cameraTargetFarY, cameraTargetMidY, cameraTargetNearY) + 20;
            lightTargetY = (sumY / 3) - 200;
        }
    });

    function moveLight(){
        var delta = lightTargetY - spotLight.position.y;
        var accelChange = delta / 100;

        lightAccel += accelChange;
        lightAccel *= 0.95;
        spotLight.position.y += lightAccel;
        if(spotLight.position.y < 1){
            spotLight.position.y = 1;
        }
        sandbox.scene.fog.far = 600 + spotLight.position.y;
        sandbox.scene.fog.near = spotLight.position.y / 2;

        hemi.intensity = 0.4 + (spotLight.position.y / 1000);
    }

    function tick(){
        requestAnimationFrame(tick);

        stats.begin();
        sandbox.render();

        moveCamera();
        moveLight();

        stats.end();
    }

    spotLight.position.x = controls.spotlightX;
    spotLight.position.z = controls.spotlightZ;
    spotLight.color = new THREE.Color(controls.spotlight);

    system.position.x = controls.systemX;
    system.position.z = controls.systemZ;
    sandbox.scene.fog = new THREE.Fog(controls.fogColour, 0, 800);

    sandbox.add(waterPlane());
    sandbox.add(skySphere());
    sandbox.add(system);
    sandbox.add(spotLight);
    sandbox.add(hemi);
    sandbox.add(fillLighting());

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
