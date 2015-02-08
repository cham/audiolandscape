define([
    'js/tree',
    'js/pointLight'
],
function(
    treeBuilder,
    pointLight
){
    'use strict';

    function buildDetailItem(position, type){
        var detailItem;

        if(type === 'tree'){
            detailItem = treeBuilder();
        }else if(type === 'light'){
            detailItem = pointLight();
        }

        detailItem.position.add(position);

        return detailItem;
    }

    function addRandomDetail(geometry, resolution, waterLevel, mountainLevel, offset, type){
        var candidateVertices = [];
        var y;
        for(var i = 0; i < resolution * 2; i++){
            y = geometry.vertices[i].y;
            if(y > waterLevel + 3 && y < mountainLevel){
                candidateVertices.push(i);
            }
        }
        if(!candidateVertices.length){
            return;
        }

        var chosenVertex = candidateVertices[Math.floor(Math.random() * candidateVertices.length)];
        var mesh = buildDetailItem(geometry.vertices[chosenVertex], type);
        mesh.position.add(offset);
        return mesh;
    }

    function destroyMesh(sandbox, mesh){
        var childMesh;
        if(mesh.children){
            for(var i = 0, numChildren = mesh.children.length; i < numChildren; i++){
                childMesh = mesh.children[i];
                sandbox.remove(childMesh);
            }
        }
        sandbox.remove(mesh);
    }

    function requiredOptions(options){
        var required = ['resolution', 'numRows', 'waterLevel', 'offsetX', 'offsetZ'];
        required.forEach(function(key){
            if(!options[key]){
                throw new Error(key + ' is required');
            }
        });
    }

    function LandscapeDetails(options){
        requiredOptions(options || {});

        this.resolution = options.resolution;
        this.numRows = options.numRows;
        this.waterLevel = options.waterLevel;
        this.offset = new THREE.Vector3(options.offsetX, 0, options.offsetZ);
        this.zUnitsPerVertex = 5;
        this.type = options.type;

        this.items = [];
    }

    LandscapeDetails.prototype.addDetail = function addDetail(geometry){
        var newMesh = addRandomDetail(geometry, this.resolution, this.waterLevel, 50, this.offset, this.type);
        if(newMesh){
            this.items.push(newMesh);
            return newMesh;
        }
    };

    LandscapeDetails.prototype.moveDetails = function moveDetails(){
        if(!this.items.length){
            return;
        }

        var zUnits = this.zUnitsPerVertex;
        this.items.forEach(function(mesh){
            mesh.position.z -= zUnits;
        });
    };

    LandscapeDetails.prototype.cullExpiredItems = function cullExpiredItems(sandbox){
        this.items = this.items.reduce(function(memo, mesh){
            if(mesh.position.z > -400){
                memo.push(mesh);
            }else{
                destroyMesh(sandbox, mesh);
            }
            return memo;
        }, []);
    };

    LandscapeDetails.prototype.onTick = function(sandbox, geometry, addDetail){
        if(addDetail){
            var detail = this.addDetail(geometry);
            if(detail){
                sandbox.add(detail);
            }
        }
        this.moveDetails();
        this.cullExpiredItems(sandbox);
    };

    return LandscapeDetails;

});
