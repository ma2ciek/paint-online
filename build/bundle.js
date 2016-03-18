/// <reference path="_all.d.ts" />
var ToolManager = (function () {
    function ToolManager() {
        this.tools = {
            pen: new Pen(),
            rubber: new Rubber(),
            fill: new Filler()
        };
        this.modules = {
            color: new ColorManager(),
            size: new SizeManager()
        };
        this.addEventListeners();
    }
    ToolManager.prototype.getActiveTool = function () {
        return this.activeTool;
    };
    ToolManager.prototype.action = function (actionName, ctx, config) {
        var obj = {};
        for (var c in config) {
            obj[c] = config[c];
        }
        for (var moduleName in this.activeTool.visibleModules) {
            obj[moduleName] = this.modules[moduleName].get();
        }
        this.activeTool[actionName] && this.activeTool[actionName](ctx, obj);
    };
    ToolManager.prototype.addEventListeners = function () {
        var self = this;
        $('#tools a').on('click', setActiveTool);
        function setActiveTool() {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            var toolName = $(this).attr('id');
            self.activateTool(toolName);
        }
        setActiveTool.call($('#tools a').eq(0));
    };
    ToolManager.prototype.activateTool = function (toolName) {
        this.activeTool = this.tools[toolName];
        for (var moduleName in this.modules) {
            this.modules[moduleName].hide();
        }
        for (var moduleName in this.activeTool.visibleModules) {
            this.modules[moduleName].show();
        }
    };
    return ToolManager;
})();
var ColorManager = (function () {
    function ColorManager() {
        this.color = '#000000';
        this.$elem = $('#color');
        this.$container = this.$elem.parent();
        this.$elem.val(this.color);
        this.addEventListeners();
    }
    ColorManager.prototype.addEventListeners = function () {
        var self = this;
        this.$elem.on('keyup', function () {
            self.color = this.value;
        });
    };
    ColorManager.prototype.get = function () {
        return this.color;
    };
    ColorManager.prototype.show = function () {
        this.$container.show();
    };
    ColorManager.prototype.hide = function () {
        this.$container.hide();
    };
    return ColorManager;
})();
var SizeManager = (function () {
    function SizeManager() {
        this.size = 4;
        this.$elem = $('#line-size');
        this.$output = $('#line-size-output');
        this.$container = this.$elem.parent();
        this.$elem.val(this.size);
        this.$output.val(this.size);
        this.addEventListeners();
    }
    SizeManager.prototype.addEventListeners = function () {
        var self = this;
        this.$elem.on('input', function () {
            self.size = +this.value;
            self.$output.val(this.value);
        });
    };
    SizeManager.prototype.get = function () {
        return this.size;
    };
    SizeManager.prototype.show = function () {
        this.$container.show();
    };
    SizeManager.prototype.hide = function () {
        this.$container.hide();
    };
    return SizeManager;
})();
/// <reference path="../_all.d.ts" />
var Filler = (function () {
    function Filler() {
        this.visibleModules = {
            color: true
        };
    }
    Filler.prototype.start = function (ctx, config) {
        var point = config.point;
        var px = ctx.getImageData(point.x, point.y, 1, 1);
        var color = px.data;
        var newColor = getArray(config.color);
        if (config.color.length != 7) {
            console.log('wrong color');
            return;
        }
        var allPixels = ctx.getImageData(0, 0, config.width, config.height);
        var points = [point];
        while (points.length > 0) {
            var point = points.pop();
            if (!isCorrect(point) || !isCloseColor(color, getCanvasDataFromPoint(point), 20) ||
                isSameColor(color, newColor)) {
                continue;
            }
            SetCanvasDataPixel(point, newColor);
            points.push(new Point(point.x, point.y + 1));
            points.push(new Point(point.x, point.y - 1));
            points.push(new Point(point.x + 1, point.y));
            points.push(new Point(point.x - 1, point.y));
        }
        ctx.putImageData(allPixels, 0, 0);
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        function getCanvasDataFromPoint(point) {
            var fromLeft = (point.y * config.width + point.x) * 4;
            return allPixels.data.slice(fromLeft, fromLeft + 4);
        }
        function isCorrect(point) {
            return point.x >= 0 && point.x < config.width &&
                point.y >= 0 && point.y < config.height;
        }
        function isSameColor(arr1, arr2) {
            for (var i = 0; i < 4; i++) {
                if (arr1[i] != arr2[i])
                    return false;
            }
            return true;
        }
        function isCloseColor(arr1, arr2, threshold) {
            var sum = 0;
            for (var i = 0; i < 4; i++)
                sum += Math.abs(arr1[i] - arr2[i]);
            return sum < threshold;
        }
        function SetCanvasDataPixel(point, color) {
            var fromLeft = (point.y * config.width + point.x) * 4;
            for (var i = 0; i < 4; i++) {
                allPixels.data[fromLeft + i] = color[i];
            }
        }
        function getArray(hexColor) {
            var toNumber = function (left) { return parseInt(hexColor.slice(left + 1, left + 3), 16); };
            return [
                toNumber(0),
                toNumber(2),
                toNumber(4),
                255
            ];
        }
    };
    return Filler;
})();
/// <reference path="../_all.d.ts" />
var Pen = (function () {
    function Pen() {
        this.lastPoint = null;
        this.visibleModules = {
            size: [1, 30],
            color: true
        };
    }
    Pen.prototype.start = function (ctx, config) {
        this.lastPoint = config.point;
        this.draw(ctx, config);
    };
    Pen.prototype.draw = function (ctx, config) {
        ctx.beginPath();
        ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
        ctx.lineTo(config.point.x, config.point.y);
        ctx.strokeStyle = config.color;
        ctx.lineWidth = config.size;
        ctx.stroke();
        this.lastPoint = config.point;
    };
    return Pen;
})();
/// <reference path="../_all.d.ts" />
var Rubber = (function () {
    function Rubber() {
        this.lastPoint = null;
        this.visibleModules = {
            size: true
        };
    }
    Rubber.prototype.start = function (ctx, config) {
        this.lastPoint = config.point;
        this.draw(ctx, config);
    };
    Rubber.prototype.draw = function (ctx, config) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
        ctx.lineTo(config.point.x, config.point.y);
        ctx.lineWidth = config.size;
        ctx.stroke();
        this.lastPoint = config.point;
        ctx.globalCompositeOperation = 'source-over';
    };
    return Rubber;
})();
/// <reference path="_all.d.ts" />
window.onload = function () {
    var canvas = $('canvas')[0];
    new Editor(canvas);
};
var Editor = (function () {
    function Editor(canvas) {
        this.mouseDown = false;
        this.lastPoint = null;
        this.toolManager = new ToolManager();
        this.canvas = canvas;
        this.initCanvas();
        this.initButtons();
        this.addEventListeners();
    }
    Editor.prototype.initCanvas = function () {
        this.resizeCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    };
    Editor.prototype.initButtons = function () {
        var ctx = this.ctx;
        var self = this;
        $('#clear').on('click', this.clear.bind(this));
        $('#save').on('click', this.save.bind(this));
    };
    Editor.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    Editor.prototype.save = function () {
        var data = this.canvas.toDataURL();
        window.open(data, '_blank');
    };
    Editor.prototype.addEventListeners = function () {
        var self = this;
        var mouseDown;
        this.canvas.addEventListener('mousedown', function (e) {
            mouseDown = true;
            self.action('start', e.layerX, e.layerY);
        });
        this.canvas.addEventListener('mouseup', function (e) {
            mouseDown = false;
            self.lastPoint = null;
            self.action('end', e.layerX, e.layerY);
        });
        this.canvas.addEventListener('mousemove', function (e) {
            var x = e.layerX;
            var y = e.layerY;
            mouseDown && self.action('draw', x, y);
            self.lastPoint = { x: x, y: y };
        });
        this.canvas.addEventListener('mouseleave', function (e) {
            mouseDown = false;
        });
        $(window).on('resize', function () {
            var data = self.ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);
            self.resizeCanvas();
            self.ctx.putImageData(data, 0, 0);
        });
    };
    Editor.prototype.resizeCanvas = function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight - $('nav').outerHeight();
    };
    Editor.prototype.action = function (actionName, x, y) {
        this.toolManager.action(actionName, this.ctx, {
            point: { x: x, y: y },
            lastPoint: this.lastPoint,
            width: this.canvas.width,
            height: this.canvas.height
        });
    };
    return Editor;
})();
//# sourceMappingURL=bundle.js.map