require([
    'js/Sandbox',
    'js/AudioData'
],function(
    Sandbox,
    AudioData
){
    'use strict';

    function makeStats(){
        var stats = new Stats();

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = 0;
        document.body.appendChild(stats.domElement);

        return stats;
    }

    function addRow(rowNum){
        for(var i = 0; i < resolution * 2; i++){
            geometry.vertices.push(new THREE.Vector3(i*3, 0, -rowNum));
        }
    }

    var stats = makeStats();
    var totalRows = 500;
    var sandbox = new Sandbox();
    var resolution = 64;
    var geometry = new THREE.Geometry();
    var material = new THREE.PointCloudMaterial({
        size: 4,
        color: 0x339900
    });
    var system = new THREE.PointCloud(geometry, material);

    for(var i = 0; i < totalRows; i++){
        addRow(i);
    }

    var audio = new AudioData({
        bufferWidth: resolution,
        src: 'mp3/canon.mp3',
        onTick: function(freqArray){
            for(var i = 0; i < resolution; i++){
                geometry.vertices[resolution+i].y = freqArray[i] / 3;
                geometry.vertices[resolution-i].y = freqArray[i] / 3;
            }
            for(var j = totalRows - 1; j > 0; j--){
                for(var k = 0; k < resolution * 2; k++){
                    var offset = j * resolution * 2;
                    var prevRow = (j-1) * resolution * 2;
                    geometry.vertices[offset + k].y = geometry.vertices[prevRow + k].y;
                }
            }
            geometry.verticesNeedUpdate = true;
        }
    });

    function tick(){
        requestAnimationFrame(tick);

        stats.begin();
        sandbox.render();
        stats.end();
    }

    system.position.x = -250;
    system.position.z = 100;

    sandbox.add(system);

    sandbox.appendTo(document.body);
    requestAnimationFrame(tick);

});
