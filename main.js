var $ = document.querySelector.bind(document);

window.onload = function () {

    var canvas = $('canvas');
    new Editor(canvas);
}

function Editor(canvas) {
    this.color = '#000';
    this.radius = 4;
    this.canvas = canvas;
    this.mouseDown = false;
    this.lastPoint = null;

        
    this.initCanvas();
    this.initButtons();
    this.addEventListeners();
}

Editor.prototype.initCanvas = function () {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineCap = 'round';
}

Editor.prototype.initButtons = function() {
    var ctx = this.ctx;
    var self = this;
    
    $('#clear').addEventListener('click', function() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    });
    
    $('#line-size').addEventListener('input', function() {
        self.radius = this.value;
        $('#line-size-output').value = this.value;
    });
    
    $('#color').addEventListener('keyup', function() {
        self.color = this.value;
    });
    
    $('#save').addEventListener('click', function() {
        var data = self.canvas.toDataURL();
        window.open(data, '_blank');
    });
}

Editor.prototype.addEventListeners = function () {
    var self = this;
    var mouseDown;

    this.canvas.addEventListener('mousedown', function (e) {
        mouseDown = true;
    });

    this.canvas.addEventListener('mouseup', function (e) {
        mouseDown = false;
        self.lastPoint = null;
    });

    this.canvas.addEventListener('mousemove', function (e) {
        var x = e.clientX;
        var y = e.clientY;

        mouseDown && self.draw(x, y)
        self.lastPoint = { x: x, y: y };
    });
};

Editor.prototype.draw = function (x, y) {
    this.lastPoint = this.lastPoint || {x: x, y: y};
    
    this.ctx.beginPath();        
    this.ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
    this.ctx.lineTo(x, y);
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.radius;    
    this.ctx.stroke();             
};