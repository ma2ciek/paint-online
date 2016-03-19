/// <reference path="../_all.d.ts" />

class Rubber implements ITool {
    lastPoint: IPoint = null;
    cursor = new CustomCursor();

    public visibleModules = ['size'];
    public modules: IModuleList = {};
    
    start(ctx: CanvasRenderingContext2D, config) {
        this.lastPoint = config.point;
        this.draw(ctx, config);
        this.cursor.set({
            color: '#fff'
        })
    }

    draw(ctx: CanvasRenderingContext2D, config) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = '#000';

        ctx.beginPath();
        ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
        ctx.lineTo(config.point.x, config.point.y);
        ctx.lineWidth = this.modules.size.get();
        ctx.stroke();
        
        this.lastPoint = config.point;

        ctx.globalCompositeOperation = 'source-over';
    }
        
    activate() {
        this.cursor.activate();
    }
    
    update(config) {
        this.cursor.set(config);
    }
}