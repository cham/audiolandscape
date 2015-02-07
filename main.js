require([
    'viz'
],function(
    viz
){
    'use strict';

    function launchVolcano(){
        viz({
            fogColour: 0x000000,
            fogMinimumDistance: 200,
            landColours: [0x221111, 0x442222, 0x9C2A00, 0xcf5f10, 0xCF1020, 0xCF1020, 0xcf5f10],
            spotlightColour: 0xa08f65,
            includeDetail: true,
            detailType: 'light',
            waterColour: 0x9C2A00,
            skyMap: 'img/cracks.jpg',
            cameraHeight: 30,
            mp3Url: 'mp3/move-around.mp3'
        });
    }

    function launchHills(){
        viz({
            fogColour: 0xfff5ac,
            fogMinimumDistance: 700,
            landColours: [0x339900, 0x72B84F, 0xCCE5BF, 0xE5F2DF, 0xF2F8EF, 0xFFFFFF, 0xEFDD6F],
            spotlightColour: 0xa08f65,
            includeDetail: true,
            detailType: 'tree',
            waterColour: 0x40a4df,
            skyMap: 'img/sky.jpg',
            cameraHeight: 5,
            mp3Url: 'mp3/morning-mood-grieg.mp3'
        });
    }

    function handleClick(){
        var introNode = document.querySelector('.intro');
        document.body.removeChild(introNode);

        if(this.className.indexOf('volcano') > -1){
            return launchVolcano();
        }
        launchHills();
    }

    var links = Array.apply(null, document.querySelectorAll('.launch'));
    links.forEach(function(link){
        link.addEventListener('click', handleClick, false);
    });

});
