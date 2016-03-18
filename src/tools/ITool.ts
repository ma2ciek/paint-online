interface ITool {
    draw? (ctx: CanvasRenderingContext2D, config: {}): void;
    
    visibleModules: {};
}

interface IPoint {
    x: number;
    y: number;
}