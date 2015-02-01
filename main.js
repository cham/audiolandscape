require([
    'js/controls',
    'js/Sandbox',
    'js/AudioData'
],function(
    datControls,
    Sandbox,
    AudioData
){
    'use strict';

    var totalRows = 100;
    var resolution = 64;
    var controls = datControls();

    var stats = makeStats();
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

    function moveCamera(){
        var delta = cameraTargetY - sandbox.camera.position.y;
        var accelChange = delta / 200;

        cameraAccel += accelChange;
        cameraAccel *= 0.9;
        sandbox.camera.position.y += cameraAccel;
        if(sandbox.camera.position.y < 1){
            sandbox.camera.position.y = 1;
        }
    }

    function moveLight(){
        var delta = lightTargetY - spotLight.position.y;
        var accelChange = delta / 100;

        lightAccel += accelChange;
        lightAccel *= 0.95;
        spotLight.position.y += lightAccel;
        if(spotLight.position.y < 1){
            spotLight.position.y = 1;
        }
        sandbox.scene.fog.far = 500 + spotLight.position.y;
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

        return new THREE.Mesh(geometry, material);
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
        var light = new THREE.DirectionalLight(0x111111);

        light.castShadow = true;
        light.shadowMapWidth = 2048;
        light.shadowMapHeight = 2048;
        light.shadowDarkness = 0.4;

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
            geometry.vertices.push(new THREE.Vector3(i * 5, 0, -rowNum * 5));
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

    var audio = new AudioData({
        bufferWidth: resolution,
        // src: 'mp3/canon.mp3',
        src: 'mp3/morning-mood-grieg.mp3',
        // src: 'mp3/lighting-of-the-beacons.mp3',
        // src: 'mp3/lighting-of-the-beacons-faded.mp3',
        // src: 'mp3/macintosh-plus.mp3',
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
            cameraTargetY = geometry.vertices[resolution].y + 20;
            lightTargetY = (sumY / 3) - 200;
        }
    });

    function tick(){
        requestAnimationFrame(tick);

        stats.begin();
        sandbox.render();

        spotLight.position.x = controls.spotlightX;
        spotLight.position.z = controls.spotlightZ;
        spotLight.color = new THREE.Color(controls.spotlight);

        system.position.x = controls.systemX;
        system.position.z = controls.systemZ;

        moveCamera();
        moveLight();

        sandbox.scene.fog.color = new THREE.Color(controls.fogColour);

        stats.end();
    }

    sandbox.scene.fog = new THREE.Fog(0xEBE3D9, 0, 800); //0xE3C598

    sandbox.add(waterPlane());
    sandbox.add(skySphere());
    sandbox.add(system);
    sandbox.add(spotLight);
    sandbox.add(hemilight());
    // sandbox.add(fillLighting());

    sandbox.appendTo(document.body);
    requestAnimationFrame(tick);

});
