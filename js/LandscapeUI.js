define([
    'js/DragDropArrayBuffer'
],
function(
    DragDropArrayBuffer
){

    var locked = false;

    function createDomNode(){
        var div = document.createElement('div');
        var textDiv = document.createElement('div');
        div.className = 'LandscapeUI';
        textDiv.textContent = 'Drag MP3 file, or click to play';
        div.appendChild(textDiv);
        return div;
    }

    function LandscapeUI(){
        this.domNode = createDomNode();
    }

    LandscapeUI.prototype.onPlayDefault = function(callback){
        var domNode = this.domNode;
        domNode.addEventListener('click', function(){
            if(locked){
                return;
            }
            domNode.remove();
            callback();
        }, false);
    };
    
    LandscapeUI.prototype.onDragAudio = function(callback){
        var domNode = this.domNode;
        domNode.addEventListener('drop', function drop(e){
            locked = true;
        });
        DragDropArrayBuffer.init(this.domNode, function(arrayBuffer){
            domNode.remove();
            callback(arrayBuffer);
        });
    };

    return LandscapeUI;

});
