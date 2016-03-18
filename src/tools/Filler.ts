/// <reference path="../_all.d.ts" />

class Filler implements ITool {
    public visibleModules = {
        color: true
    };
    
    start(ctx, config) {
        var point = config.point;
        
        var px = ctx.getImageData(point.x, point.y, 1, 1);
        var color = px.data;
        var newColor = getArray(config.color)
        
        if(config.color.length != 7) {
            console.log('wrong color');
            return;
        }
        
        var allPixels = ctx.getImageData(0, 0, config.width , config.height);
        
        var points = [point];      
        while(points.length > 0) {
            var point = points.pop();
            if(!isCorrect(point) || !isCloseColor(color, getCanvasDataFromPoint(point), 20) || 
            isSameColor(color, newColor)) {
                continue;                
            }
                
            SetCanvasDataPixel(point, newColor)
            
            points.push(new Point(point.x, point.y + 1));
            points.push(new Point(point.x, point.y - 1));
            points.push(new Point(point.x + 1, point.y));
            points.push(new Point(point.x - 1, point.y)); 
        }
        
        ctx.putImageData(allPixels, 0, 0);
        
        function Point (x, y) {
            this.x = x;
            this.y = y;
        }
        
        function getCanvasDataFromPoint (point) {
            var fromLeft = (point.y * config.width + point.x) * 4
            return allPixels.data.slice(fromLeft, fromLeft + 4);
        }
        
        function isCorrect(point) {
            return point.x >= 0 && point.x < config.width &&
                point.y >= 0 && point.y < config.height;
        }
        
        function isSameColor(arr1, arr2) {
            for(var i=0; i<4; i++) {
                if(arr1[i] != arr2[i])
                    return false;
            }
            return true;
        }
        
        function isCloseColor(arr1, arr2, threshold) {
            var sum = 0;
            for(var i=0; i<4; i++) 
                sum += Math.abs(arr1[i] - arr2[i]);
            return sum < threshold;
        }
        
        function SetCanvasDataPixel(point, color) {
            var fromLeft = (point.y * config.width + point.x) * 4;
            
             for(var i=0; i<4; i++) {
                 allPixels.data[fromLeft + i] = color[i];
             }
        }
        
            
        function getArray (hexColor) {
            var toNumber = (left) => parseInt(hexColor.slice(left + 1, left + 3), 16)
            return [ 
                toNumber(0),
                toNumber(2),
                toNumber(4),
                255            
            ]
        }

    }
    
    
}

