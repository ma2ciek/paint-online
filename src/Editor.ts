/// <reference path="_all.d.ts" />

window.onload = function() {
    var canvas = <HTMLCanvasElement>$('canvas')[0];
    new Editor(canvas);
}

class Editor {
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private toolManager = new ToolManager();
    private history: HistoryManager;
    private imgDownloader = new ImageDownloader();

    constructor(canvas) {
        this.canvas = canvas;
        this.initCanvas();
        this.initButtons();
        this.addEventListeners();
        this.history = new HistoryManager(canvas);
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
        $('#save').on('click', () => this.imgDownloader.save(this.canvas));
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.history.add();
    }

    addEventListeners() {
        var self = this;
        var mouseDown;

        this.canvas.addEventListener('mousedown', function(e) {
            mouseDown = true;
            self.action('start', self.getRelativePosition(e));
        });

        this.canvas.addEventListener('mouseup', function(e) {
            mouseDown = false;
            self.action('end', self.getRelativePosition(e));
            self.history.add();
        });

        this.canvas.addEventListener('mousemove', function(e) {
            mouseDown && self.action('draw', self.getRelativePosition(e));
        });

        this.canvas.addEventListener('mouseleave', function(e) {
            mouseDown && self.action('draw', self.getRelativePosition(e));            
            mouseDown = false
        });
    }

    getRelativePosition(e: MouseEvent) {
        var rect = (<HTMLCanvasElement>e.target).getBoundingClientRect();
        return new util.Point(e.clientX - rect.left, e.clientY - rect.top);
    }

    resizeCanvas() {
        this.canvas.width = 1000;
        this.canvas.height = 500;
    }

    action(actionName: string, point: util.IPoint) {
        this.toolManager.action(actionName, this.ctx, {
            point,
            width: this.canvas.width,
            height: this.canvas.height
        });
    }
}