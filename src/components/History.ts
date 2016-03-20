class HistoryManager {
    private list: ImageData[];
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private index: number;

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.clear();
        this.addEventListeners();
    }

    private clear() {
        this.list = [];
        this.index = 0;
        this.add();
    }

    private addEventListeners() {
        $('#undo').on('click', () => this.undo());
        $('#redo').on('click', () => this.redo());
    }

    undo() {
        if (this.index < 2)
            return;

        this.go(-1)
    }

    redo() {
        if (this.index >= this.list.length)
            return;

        this.go(+1);
    }

    private go(direction) {
        this.index += direction;
        var img = this.list[this.index - 1];
        this.ctx.putImageData(img, 0, 0);
    }

    add() {
        this.list.splice(this.index);
        var img = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.list.push(img);
        this.index++
    }
}