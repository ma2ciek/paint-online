/// <reference path="_all.d.ts" />
window.onload = function () {
    var canvas = $('canvas')[0];
    new Editor(canvas);
};
var Editor = (function () {
    function Editor(canvas) {
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
            self.action('start', self.getRelativePosition(e));
        });
        this.canvas.addEventListener('mouseup', function (e) {
            mouseDown = false;
            self.action('end', self.getRelativePosition(e));
        });
        this.canvas.addEventListener('mousemove', function (e) {
            mouseDown && self.action('draw', self.getRelativePosition(e));
        });
        this.canvas.addEventListener('mouseleave', function (e) {
            mouseDown = false;
        });
        // $(window).on('resize', () => this.handleResizeEvent);
    };
    Editor.prototype.handleResizeEvent = function () {
        var data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.resizeCanvas();
        this.ctx.putImageData(data, 0, 0);
    };
    Editor.prototype.getRelativePosition = function (e) {
        var rect = e.target.getBoundingClientRect();
        return new util.Point(e.clientX - rect.left, e.clientY - rect.top);
    };
    Editor.prototype.resizeCanvas = function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight - $('nav').outerHeight();
    };
    Editor.prototype.action = function (actionName, point) {
        this.toolManager.action(actionName, this.ctx, {
            point: point,
            width: this.canvas.width,
            height: this.canvas.height
        });
    };
    return Editor;
})();
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
            size: new SizeManager(),
            threshold: new Threshold()
        };
        this.addEventListeners();
        this.watchModules();
        this.connectToolsWidthModules();
    }
    ToolManager.prototype.connectToolsWidthModules = function () {
        for (var toolName in this.tools) {
            var tool = this.tools[toolName];
            for (var _i = 0, _a = tool.visibleModules; _i < _a.length; _i++) {
                var moduleName = _a[_i];
                var module = this.modules[moduleName];
                tool.modules[moduleName] = module;
            }
        }
    };
    ToolManager.prototype.watchModules = function () {
        var _this = this;
        for (var name in this.modules) {
            this.modules[name].on('change', function (obj) { return _this.activeTool.update(obj); });
        }
    };
    ToolManager.prototype.getActiveTool = function () {
        return this.activeTool;
    };
    ToolManager.prototype.action = function (actionName, ctx, config) {
        this.activeTool[actionName] && this.activeTool[actionName](ctx, config);
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
        this.activeTool.activate();
        for (var moduleName in this.modules) {
            this.modules[moduleName].hide();
        }
        for (var _i = 0, _a = this.activeTool.visibleModules; _i < _a.length; _i++) {
            var modName = _a[_i];
            this.modules[modName].show();
        }
    };
    return ToolManager;
})();
/// <reference path="_all.d.ts" />
var EventEmitter = (function () {
    function EventEmitter() {
        this.events = {};
    }
    EventEmitter.prototype.on = function (name, fn) {
        if (!this.events[name])
            this.events[name] = [];
        this.events[name].push(fn);
    };
    EventEmitter.prototype.emit = function (name, value) {
        if (!this.events[name])
            return;
        for (var _i = 0, _a = this.events[name]; _i < _a.length; _i++) {
            var fn = _a[_i];
            fn(value);
        }
    };
    return EventEmitter;
})();
var util;
(function (util) {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    util.Point = Point;
})(util || (util = {}));
/// <reference path="../_all.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ColorManager = (function (_super) {
    __extends(ColorManager, _super);
    function ColorManager() {
        _super.call(this);
        this.color = '#000000';
        this.$elem = $('#color');
        this.$container = this.$elem.parent();
        this.$elem.val(this.color);
        this.addEventListeners();
    }
    ColorManager.prototype.addEventListeners = function () {
        var _this = this;
        this.$elem.on('input', function (e) {
            return _this.maybeSetColor(e.target.value);
        });
    };
    ColorManager.prototype.maybeSetColor = function (color) {
        if (this.testColor(color)) {
            this.color = color;
            this.emit('change', { color: this.color });
        }
        ;
    };
    ColorManager.prototype.testColor = function (color) {
        return /^#[0-9a-f]{3}$/.test(color) ||
            /^#[0-9a-f]{6}$/.test(color);
    };
    ColorManager.prototype.get = function () {
        return this.color;
    };
    ColorManager.prototype.getArray = function () {
        return [
            this.parseHexNumber(1, 3),
            this.parseHexNumber(3, 5),
            this.parseHexNumber(5, 7),
            255
        ];
    };
    ColorManager.prototype.parseHexNumber = function (from, to) {
        return parseInt(this.color.slice(from, to), 16);
    };
    ColorManager.prototype.show = function () {
        this.$container.show();
    };
    ColorManager.prototype.hide = function () {
        this.$container.hide();
    };
    return ColorManager;
})(EventEmitter);
/// <reference path="../_all.d.ts" />
var SizeManager = (function (_super) {
    __extends(SizeManager, _super);
    function SizeManager() {
        _super.call(this);
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
            self.emit('change', { radius: +this.value });
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
})(EventEmitter);
/// <reference path="../_all.d.ts" />
var Threshold = (function (_super) {
    __extends(Threshold, _super);
    function Threshold() {
        _super.call(this);
        this.size = 5;
        this.$elem = $('#threshold');
        this.$container = this.$elem.parent();
        this.$elem.val(this.size);
        this.addEventListeners();
    }
    Threshold.prototype.addEventListeners = function () {
        var self = this;
        this.$elem.on('input', function () {
            console.log(2);
            self.size = +this.value;
            self.emit('change', { threshold: +this.value });
        });
    };
    Threshold.prototype.get = function () {
        return this.size;
    };
    Threshold.prototype.show = function () {
        this.$container.show();
    };
    Threshold.prototype.hide = function () {
        this.$container.hide();
    };
    return Threshold;
})(EventEmitter);
/// <reference path="../_all.d.ts" />
/// <reference path="../_all.d.ts" />
var Filler = (function () {
    function Filler() {
        this.visibleModules = ['color', 'threshold'];
        this.modules = {};
        this.recFiller = new RecursiveFiller();
        this.cursor = new CustomCursor({
            url: 'https://cdn2.iconfinder.com/data/icons/windows-8-metro-style/32/paint_bucket.png',
            top: -20,
            left: -20
        });
    }
    Filler.prototype.start = function (ctx, config) {
        var point = config.point;
        // TODO: Test color
        if (this.modules.color.get().length != 7) {
            console.log('wrong color');
            return;
        }
        this.recFiller.getFilledCanvasData({
            start: point,
            threshold: this.modules.threshold.get(),
            color: ctx.getImageData(point.x, point.y, 1, 1).data,
            newColor: this.modules.color.getArray(),
            data: ctx.getImageData(0, 0, config.width, config.height),
        }).then(function (data) {
            ctx.putImageData(data, 0, 0);
        });
    };
    Filler.prototype.update = function () { };
    Filler.prototype.activate = function () {
        this.cursor.activate();
    };
    return Filler;
})();
/// <reference path="../_all.d.ts" />
var Pen = (function () {
    function Pen() {
        this.lastPoint = null;
        this.cursor = new CustomCursor();
        this.visibleModules = ['size', 'color'];
        this.modules = {};
    }
    Pen.prototype.start = function (ctx, config) {
        var radius = this.modules.size.get() / 2;
        ctx.beginPath();
        ctx.arc(config.point.x, config.point.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.modules.color.get();
        ctx.fill();
        this.lastPoint = config.point;
    };
    Pen.prototype.draw = function (ctx, config) {
        ctx.beginPath();
        ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
        ctx.lineTo(config.point.x, config.point.y);
        ctx.strokeStyle = this.modules.color.get();
        ctx.lineWidth = this.modules.size.get();
        console.log(ctx.lineWidth);
        ctx.closePath();
        ctx.stroke();
        this.lastPoint = config.point;
    };
    Pen.prototype.activate = function () {
        this.cursor.activate();
    };
    Pen.prototype.update = function (config) {
        this.cursor.set(config);
    };
    return Pen;
})();
/// <reference path="../_all.d.ts" />
var Rubber = (function () {
    function Rubber() {
        this.lastPoint = null;
        this.cursor = new CustomCursor();
        this.visibleModules = ['size'];
        this.modules = {};
    }
    Rubber.prototype.start = function (ctx, config) {
        this.lastPoint = config.point;
        this.draw(ctx, config);
        this.cursor.set({
            color: '#fff'
        });
    };
    Rubber.prototype.draw = function (ctx, config) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
        ctx.lineTo(config.point.x, config.point.y);
        ctx.lineWidth = this.modules.size.get();
        ctx.stroke();
        this.lastPoint = config.point;
        ctx.globalCompositeOperation = 'source-over';
    };
    Rubber.prototype.activate = function () {
        this.cursor.activate();
    };
    Rubber.prototype.update = function (config) {
        this.cursor.set(config);
    };
    return Rubber;
})();
/// <reference path="_all.d.ts" />
var CustomCursor = (function () {
    function CustomCursor(config) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.radius = 4;
        this.color = '#000';
        this.set(config || {});
    }
    CustomCursor.prototype.set = function (config) {
        $.extend(this, config);
        this.activate();
    };
    CustomCursor.prototype.activate = function () {
        if (this.url) {
            this.getFromUrl();
        }
        else {
            this.renderCursor();
            this.createURL();
        }
    };
    CustomCursor.prototype.renderCursor = function () {
        var radius = this.radius / 2; // ??
        var color = this.color;
        var ctx = this.ctx;
        this.canvas.width = 2 * radius;
        this.canvas.height = 2 * radius;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = '#000';
        ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
    CustomCursor.prototype.createURL = function () {
        var url = this.canvas.toDataURL();
        this.createCssUrl(url, this.radius / 2, this.radius / 2, "crosshair");
    };
    CustomCursor.prototype.getFromUrl = function () {
        this.createCssUrl(this.url, this.left, this.top, "crosshair");
    };
    CustomCursor.prototype.createCssUrl = function (url, left, top, _default) {
        var cssURL = "url('" + url + "')" + left + ' ' + top + ", " + _default;
        this.setCursorFromURL(cssURL);
    };
    CustomCursor.prototype.setCursorFromURL = function (url) {
        document.body.style.cursor = url;
    };
    return CustomCursor;
})();
/// <reference path="../_all.d.ts" />
var RecursiveFiller = (function () {
    function RecursiveFiller() {
    }
    RecursiveFiller.prototype.getFilledCanvasData = function (obj) {
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
            if (!this.shouldFillPoint(point, color, newColor, threshold))
                continue;
            this.setCanvasDataPixel(point, newColor);
            points.push(new util.Point(point.x, point.y + 1));
            points.push(new util.Point(point.x, point.y - 1));
            points.push(new util.Point(point.x + 1, point.y));
            points.push(new util.Point(point.x - 1, point.y));
        }
        return { then: function (callback) { return callback(data); } };
    };
    RecursiveFiller.prototype.shouldFillPoint = function (point, color, newColor, threshold) {
        var pxColor = this.getCanvasDataFromPoint(point);
        return this.isCorrect(point) &&
            this.isCloseColor(color, pxColor, threshold) &&
            !this.isSameColor(color, newColor);
    };
    RecursiveFiller.prototype.getCanvasDataFromPoint = function (point) {
        var fromLeft = (point.y * this.width + point.x) * 4;
        return this.pixels.slice(fromLeft, fromLeft + 4);
    };
    RecursiveFiller.prototype.isCorrect = function (point) {
        return point.x >= 0 && point.x < this.width &&
            point.y >= 0 && point.y < this.height;
    };
    RecursiveFiller.prototype.isSameColor = function (arr1, arr2) {
        for (var i = 0; i < 4; i++) {
            if (arr1[i] != arr2[i])
                return false;
        }
        return true;
    };
    RecursiveFiller.prototype.isCloseColor = function (arr1, arr2, threshold) {
        var sum = 0;
        for (var i = 0; i < 4; i++)
            sum += Math.abs(arr1[i] - arr2[i]);
        return sum < threshold;
    };
    RecursiveFiller.prototype.setCanvasDataPixel = function (point, color) {
        var fromLeft = (point.y * this.width + point.x) * 4;
        for (var i = 0; i < 4; i++) {
            this.pixels[fromLeft + i] = color[i];
        }
    };
    return RecursiveFiller;
})();
//# sourceMappingURL=bundle.js.map