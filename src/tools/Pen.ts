/// <reference path="../_all.d.ts" />

class Pen implements ITool {
    lastPoint: IPoint = null;
    cursor = new CustomCursor();

    public visibleModules = ['size', 'color'];
    public modules: IModuleList = {};

    start(ctx: CanvasRenderingContext2D, config: IToolManagerConfig) {
        var radius = this.modules.size.get() / 2;

        ctx.beginPath();
        ctx.arc(config.point.x, config.point.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.modules.color.get();        
        ctx.fill();

        this.lastPoint = config.point;
    }

    draw(ctx, config) {
        // var distance = Math.pow(util.Point.distance(config.point, this.lastPoint) + 1, 1/5);
        
        ctx.beginPath();
        ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
        ctx.lineTo(config.point.x, config.point.y);
        ctx.strokeStyle = this.modules.color.get();
        ctx.lineWidth = this.modules.size.get() 
        ctx.closePath();
        ctx.stroke();
        this.lastPoint = config.point;
    }

    activate() {
        this.cursor.activate();
    }

    update(config) {
        this.cursor.set(config);
    }
}
