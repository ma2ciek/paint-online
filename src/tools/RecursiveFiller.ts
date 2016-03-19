/// <reference path="../_all.d.ts" />

interface IRecursiveFillerData {
    start: IPoint,
    threshold: number;
    color: number[];
    newColor: number[];
    data: ImageData;
}

class RecursiveFiller {
    pixels: number[];
    width: number;
    height: number;

    getFilledCanvasData(obj: IRecursiveFillerData) {
        var start = obj.start;
        var color = obj.color;
        var data = obj.data;
        var newColor = obj.newColor;
        var threshold = obj.threshold;

        this.pixels = data.data;
        this.width = data.width;
        this.height = data.height;
        
        // TODO: Optimisation
        var points = [start];
        while (points.length > 0) {
            var point = points.pop();
            
            if(!this.shouldFillPoint(point, color, newColor, threshold))
                continue;
            
            this.setCanvasDataPixel(point, newColor)

            points.push(new util.Point(point.x, point.y + 1));
            points.push(new util.Point(point.x, point.y - 1));
            points.push(new util.Point(point.x + 1, point.y));
            points.push(new util.Point(point.x - 1, point.y));
        }

        return { then: callback => callback(data) }
    }

    shouldFillPoint(point, color, newColor, threshold) {
        var pxColor = this.getCanvasDataFromPoint(point);
        return this.isCorrect(point) &&
            this.isCloseColor(color, pxColor, threshold) &&
            !this.isSameColor(color, newColor);
    }

    getCanvasDataFromPoint(point: IPoint) {
        var fromLeft = (point.y * this.width + point.x) * 4
        return this.pixels.slice(fromLeft, fromLeft + 4);
    }

    isCorrect(point: IPoint) {
        return point.x >= 0 && point.x < this.width &&
            point.y >= 0 && point.y < this.height;
    }

    isSameColor(arr1: number[], arr2: number[]) {
        for (var i = 0; i < 4; i++) {
            if (arr1[i] != arr2[i])
                return false;
        }
        return true;
    }

    isCloseColor(arr1: number[], arr2: number[], threshold: number) {
        var sum = 0;
        for (var i = 0; i < 4; i++)
            sum += Math.abs(arr1[i] - arr2[i]);
        return sum < threshold;
    }

    setCanvasDataPixel(point: IPoint, color: number[]) {
        var fromLeft = (point.y * this.width + point.x) * 4;

        for (var i = 0; i < 4; i++) {
            this.pixels[fromLeft + i] = color[i];
        }
    }
}