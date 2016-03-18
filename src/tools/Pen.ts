/// <reference path="ITool" />

class Pen implements ITool {
    lastPoint: IPoint = null;
    
    public visibleModules = {
        size: [1, 30],
        color: true
    };
    
    start(ctx, config) {
        this.lastPoint = config.point;
        this.draw(ctx, config);
    }
    
    draw(ctx, config) {        
        ctx.beginPath();
        ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
        ctx.lineTo(config.point.x, config.point.y);
        ctx.strokeStyle = config.color;
        ctx.lineWidth = config.size;
        ctx.stroke();
        this.lastPoint = config.point;
    }
}
