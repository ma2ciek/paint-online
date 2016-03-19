/// <reference path="../_all.d.ts" />

class Filler implements ITool {
    public visibleModules = ['color', 'threshold'];
    public modules: IModuleList = {};

    private recFiller = new RecursiveFiller();
    private cursor = new CustomCursor({
        url: 'https://cdn2.iconfinder.com/data/icons/windows-8-metro-style/32/paint_bucket.png',
        top: -20,
        left: -20
    });

    start(ctx: CanvasRenderingContext2D, config: IToolManagerConfig) {
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
        }).then(function(data) {
            ctx.putImageData(data, 0, 0);            
        });       
    }

    update() { }

    activate() {
        this.cursor.activate();
    }
}