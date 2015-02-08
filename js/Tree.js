define(function(){

    var treeGeom = new THREE.CylinderGeometry(0.1, 0.4, 6, 3);
    var treeMaterial = new THREE.MeshLambertMaterial({
        color: 0x87421F
    });
    var treeMesh = new THREE.Mesh(treeGeom, treeMaterial);
    treeMesh.castShadow = true;

    var leafGeom = new THREE.SphereGeometry(0.75);
    var leafMaterial = new THREE.MeshLambertMaterial({
        color: 0x61B329
    });
    var leafMesh = new THREE.Mesh(leafGeom, leafMaterial);
    leafMesh.castShadow = true;
    leafMesh.receiveShadow = true;

    function trunk(){
        return treeMesh.clone();
    }

    function leaves(xPosition, yPosition, zPosition){
        var mesh = leafMesh.clone();

        mesh.position.x = xPosition;
        mesh.position.y = yPosition;
        mesh.position.z = zPosition;

        return mesh;
    }

    function fuzzy(min, max){
        var range = max - min;
        return min + (Math.random() * range) - (range / 2);
    }

    function buildTree(){
        var group = new THREE.Group();

        group.add(trunk());
        group.add(leaves(fuzzy(0, 0.3), 3 + fuzzy(0, 0.3), fuzzy(0, 0.3)));
        group.add(leaves(fuzzy(-0.3, 0.3), 2.5 + fuzzy(0, 0.3), fuzzy(-0.3, 0.3)));
        group.add(leaves(fuzzy(-0.3, 0), 3 + fuzzy(0, 0.3), fuzzy(-0.3, 0)));

        var scale = 0.5 + Math.random();
        group.scale.set(scale, scale, scale);

        return group;
    }

    return buildTree;

});
