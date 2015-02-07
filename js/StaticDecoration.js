define(function(){
    'use strict';

    function buildSkySphere(){
        var texture = THREE.ImageUtils.loadTexture('img/sky.jpg');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);
        var geometry = new THREE.SphereGeometry(400, 32, 32);
        var material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide
        });
        var mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(0, 0, -50);

        return mesh;
    }

    function buildWaterPlane(waterLevel){
        var geometry = new THREE.PlaneGeometry(2000, 2000);
        var material = new THREE.MeshPhongMaterial({
            color: 0x40a4df,
            shininess: 90
        });
        var mesh = new THREE.Mesh(geometry, material);

        mesh.rotation.x = -Math.PI / 2;
        mesh.position.y = waterLevel;

        return mesh;
    }

    function requiredOptions(options){
        ['waterLevel'].forEach(function(key){
            if(!options[key]){
                throw new Error(key + ' is required');
            }
        });
    }

    function StaticDecoration(options){
        requiredOptions(options || {});

        this.skySphere = buildSkySphere();
        this.waterPlane = buildWaterPlane(options.waterLevel);
    }

    StaticDecoration.prototype.getObjects = function(){
        var group = new THREE.Group();
        group.add(this.skySphere);
        group.add(this.waterPlane);
        return group;
    };

    return StaticDecoration;

});
