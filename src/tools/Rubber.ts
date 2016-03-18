/// <reference path="ITool" />

class Rubber implements ITool {
    lastPoint: IPoint = null;
    
    public visibleModules = {
        size: true
    };
    
    start(ctx, config) {
        this.lastPoint = config.point;
        this.draw(ctx, config);
    }

    draw(ctx, config) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = '#000';

        ctx.beginPath();
        ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
        ctx.lineTo(config.point.x, config.point.y);
        ctx.lineWidth = config.size;
        ctx.stroke();
        
        this.lastPoint = config.point;

        ctx.globalCompositeOperation = 'source-over';
    }
}