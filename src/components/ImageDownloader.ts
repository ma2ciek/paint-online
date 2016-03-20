class ImageDownloader {  
    save(canvas) {
        var data = canvas.toDataURL();
        var blob = this.dataURItoBlob(data);
        this.download(blob);
    }
     
    private dataURItoBlob(dataURI) {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: 'image/png'});
    }
    
    private download(file) {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        (<any> a).download = 'canvas_image';
        a.click();
    }
}