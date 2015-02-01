define(function(){

    return {
        init: function(node, callback){
            node.addEventListener('drop', function drop(e){
                e.stopPropagation();
                e.preventDefault();

                var file = e.dataTransfer.files[0];
                var reader = new FileReader();

                reader.onload = function(event){
                    callback(event.target.result);
                };

                reader.readAsArrayBuffer(file);
            }, false);

            node.addEventListener('dragover', function dragOver(e){
                e.stopPropagation();
                e.preventDefault();
                return false;
            }, false);
        }
    }
    
});
