define(function(){
    'use strict';

    var camTarget = new THREE.Vector3(0, 50, -100);

    function windowSize(){
        return {
            width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
            height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
        };
    }

    function renderer(){
        var glRenderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        
        glRenderer.setClearColor(0xeeeeee, 1);
        glRenderer.shadowMapEnabled = true;

        return glRenderer;
    }

    function camera(){
        var wSize = windowSize();
        var cam = new THREE.PerspectiveCamera(40, wSize.width / wSize.height, 1, 20000);
        
        cam.position.set(0, 100, -400);
        cam.lookAt(camTarget);

        return cam;
    }

    function rotateCamera(cam, ticks){
        var cameraDistance = 150;
        var targetY = 25 + (Math.sin(ticks * 0.02) * camTarget.y);
        cam.position.x = Math.PI - Math.cos(ticks * 0.01) * cameraDistance;

        cam.lookAt(new THREE.Vector3(cam.position.x * 0.66, targetY, -100));
    }

    function Sandbox(){
        this.scene = new THREE.Scene();
        this.renderer = renderer();
        this.camera = camera();

        this.resize();
        this.animate();
    }

    Sandbox.prototype.resize = function resize(){
        var wSize = windowSize();
        this.renderer.setSize(wSize.width, wSize.height);
        this.camera.aspect = wSize.width / wSize.height;
        this.camera.updateProjectionMatrix();
    };

    Sandbox.prototype.animate = function(){
        var cam = this.camera;
        var numTicks = 0;

        function tick(){
            requestAnimationFrame(tick);
            rotateCamera(cam, numTicks+=0.4);
        }
        tick();
    };

    Sandbox.prototype.appendTo = function appendTo(node){
        node.appendChild(this.renderer.domElement);
    };

    Sandbox.prototype.render = function render(){
        this.renderer.render(this.scene, this.camera);
    };

    Sandbox.prototype.add = function add(threeObject){
        this.scene.add(threeObject);
    };

    Sandbox.prototype.remove = function remove(threeObject){
        this.scene.remove(threeObject);
    };

    return Sandbox;

});
