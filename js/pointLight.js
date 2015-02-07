define(function(){

    var fakeLightGeom = new THREE.SphereGeometry(2, 3);
    var fakeLightMat = new THREE.MeshBasicMaterial({color: 0x330000});
    var fakeLightMesh = new THREE.Mesh(fakeLightGeom, fakeLightMat);

    var fakeLightMat2 = new THREE.MeshBasicMaterial({color: 0xCF1020});
    var fakeLightMesh2 = new THREE.Mesh(fakeLightGeom, fakeLightMat2);

    var fakeLightMat3 = new THREE.MeshBasicMaterial({color: 0x9C2A00});
    var fakeLightMesh3 = new THREE.Mesh(fakeLightGeom, fakeLightMat3);

    function buildLight(){
        var mesh;
        var random = Math.floor(Math.random() * 3);
        if(random === 2){
            mesh = fakeLightMesh3.clone();
        }else if(random === 1){
            mesh = fakeLightMesh2.clone();
        }else{
            mesh = fakeLightMesh.clone();
        }
        mesh.scale.set(Math.random(), 1, Math.random());
        mesh.position.y = -1;
        return mesh;
    }

    return buildLight;

});
