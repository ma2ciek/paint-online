interface ITool {
    draw?(ctx: CanvasRenderingContext2D, config: {}): void;
    start?(ctx: CanvasRenderingContext2D, config: {}): void;
    end?(ctx: CanvasRenderingContext2D, config: {}): void;
    activate(): void;
    update(config: {}): void;
    visibleModules: string[];
    modules: {};
}

interface IPoint {
    x: number;
    y: number;
}