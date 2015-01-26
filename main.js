require([
    'js/Sandbox',
    'js/AudioData'
],function(
    Sandbox,
    AudioData
){
    'use strict';

    function addRow(rowNum){
        for(var i = 0; i < resolution * 2; i++){
            geometry.vertices.push(new THREE.Vector3(i*4, 0, -rowNum));
        }
    }

    // function makeFaces(geometry){
    //     var rowWidth = resolution * 2;
    //     var totalVertices = geometry.vertices.length;
    //     var totalRows = totalVertices / rowWidth;
    //     for(var rowNum = 0; rowNum < totalRows - 2; rowNum++){
    //         for(var vertexNum = 0; vertexNum < rowWidth; vertexNum++){
    //             var rowOffset = rowNum * rowWidth;
    //             var leftCorner = rowOffset + vertexNum;
    //             geometry.faces.push(new THREE.Face3(leftCorner, leftCorner + 1, leftCorner + rowWidth));
    //             geometry.faces.push(new THREE.Face3(leftCorner + rowWidth, leftCorner + rowWidth + 1, leftCorner + 1));
    //         }
    //     }
    // }

    var totalRows = 400;
    var sandbox = new Sandbox();
    var resolution = 32;
    var geometry = new THREE.Geometry();
    var material = new THREE.PointCloudMaterial({
        size: 5,
        color: 0x003399
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
        sandbox.render();
    }

    sandbox.add(system);

    sandbox.appendTo(document.body);
    requestAnimationFrame(tick);

});
