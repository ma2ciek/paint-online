/// <reference path="../_all.d.ts" />

class ColorManager extends EventEmitter {
    private color = '#000000';
    private $elem = $('#color');
    private $container = this.$elem.parent();

    constructor() {
        super();
        this.$elem.val(this.color);
        this.addEventListeners();
    }

    private addEventListeners() {
        this.$elem.on('input', (e: JQueryInputEventObject) => 
            this.maybeSetColor((<HTMLInputElement> e.target).value))
    }

    private maybeSetColor(color: string) {
        if (this.testColor(color)) {
            this.color = color;
            this.emit('change', { color: this.color });
        };
    }

    testColor(color: string) {
        return /^#[0-9a-f]{3}$/.test(color) ||
            /^#[0-9a-f]{6}$/.test(color);
    }

    get() {
        return this.color;
    }

    getArray() {
        return [
            this.parseHexNumber(1, 3),
            this.parseHexNumber(3, 5),
            this.parseHexNumber(5, 7),
            255
        ];
    }
    
    private parseHexNumber(from, to) {
        return parseInt(this.color.slice(from, to), 16);
    }

    show() {
        this.$container.show();
    }

    hide() {
        this.$container.hide();
    }
}