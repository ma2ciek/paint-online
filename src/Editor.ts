/// <reference path="_all.d.ts" />

window.onload = function() {
    var canvas = <HTMLCanvasElement>$('canvas')[0];
    new Editor(canvas);
}

class Editor {
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private mouseDown = false;
    private lastPoint: { x: number, y: number } = null;
    private toolManager = new ToolManager();

    constructor(canvas) {
        this.canvas = canvas;
        this.initCanvas();
        this.initButtons();
        this.addEventListeners();
    }

    initCanvas() {
        this.resizeCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    initButtons() {
        var ctx = this.ctx;
        var self = this;

        $('#clear').on('click', this.clear.bind(this));
        $('#save').on('click', this.save.bind(this));
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    save() {
        var data = this.canvas.toDataURL();
        window.open(data, '_blank');
    }

    addEventListeners() {
        var self = this;
        var mouseDown;

        this.canvas.addEventListener('mousedown', function(e) {
            mouseDown = true;
            self.action('start', e.layerX, e.layerY);            
        });

        this.canvas.addEventListener('mouseup', function(e) {
            mouseDown = false;
            self.lastPoint = null;
            self.action('end', e.layerX, e.layerY);
        });

        this.canvas.addEventListener('mousemove', function(e) {
            var x = e.layerX
            var y = e.layerY;

            mouseDown && self.action('draw', x, y);
            self.lastPoint = { x: x, y: y };
        });

        this.canvas.addEventListener('mouseleave', function(e) {
            mouseDown = false
        });

        $(window).on('resize', function() {
            var data = self.ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);
            self.resizeCanvas();
            self.ctx.putImageData(data, 0, 0);
        });
    }

    resizeCanvas() {
       
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight  - $('nav').outerHeight()
    }

    action(actionName: string, x: number, y: number) {
        this.toolManager.action(actionName, this.ctx, {
            point: { x, y },
            lastPoint: this.lastPoint,
            width: this.canvas.width,
            height: this.canvas.height
        });
    }
}