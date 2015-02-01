define(function(){
    'use strict';

    function loadUrl(url, onloadfn, onerrorfn){
    }

    function requiredOptions(opt){
        // if(!opt.src){
        //     throw new Error('src is required');
        // }
        if(!opt.bufferWidth){
            throw new Error('bufferWidth is required');
        }
        if(!opt.onTick){
            throw new Error('onTick is required');
        }
    }

    function AudioData(options){
        requiredOptions(options || {});

        this.bufferWidth = options.bufferWidth;
        this.onTick = options.onTick;

        if(options.src){
            this.loadUrl(options.src);
        }
    }

    AudioData.prototype.loadUrl = function loadUrl(url){
        var xhr = new XMLHttpRequest();
        var onLoadAudio = this.onLoadAudio.bind(this);
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function(){
            onLoadAudio(xhr.response);
        };

        xhr.send();
    };

    AudioData.prototype.onLoadAudio = function onLoadAudio(data){
        var context = new AudioContext();
        var bufferWidth = this.bufferWidth * 2;
        var that = this;

        context.decodeAudioData(data, function(buffer){
            var analyser = context.createAnalyser();

            analyser.connect(context.destination);
            analyser.fftSize = bufferWidth;

            that.source = context.createBufferSource();
            that.source.buffer = buffer;
            that.source.connect(analyser);

            that.start(analyser, bufferWidth);
        });
    };

    AudioData.prototype.start = function(analyser, bufferWidth){
        var dataArray = new Uint8Array(bufferWidth);
        var onTick = this.onTick;
        var bufferWidth = this.bufferWidth;

        var numTicks = 0;
        function tick(){
            requestAnimationFrame(tick);

            analyser.getByteFrequencyData(dataArray);

            onTick(Array.apply(null, dataArray).slice(0, bufferWidth));
        }

        this.source.start(0);
        requestAnimationFrame(tick);
    };

    return AudioData;

});
