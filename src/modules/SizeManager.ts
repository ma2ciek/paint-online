/// <reference path="../_all.d.ts" />

class SizeManager extends EventEmitter {
    private size = 4;
    private $elem = $('#line-size');
    private $output = $('#line-size-output');
    private $container = this.$elem.parent();

    constructor() {
        super();
        this.$elem.val(this.size);
        this.$output.val(this.size);
        this.addEventListeners();
    }

    private addEventListeners() {
        var self = this;
        this.$elem.on('input', function() {
            self.size = +this.value;
            self.$output.val(this.value);
            self.emit('change', {radius: +this.value});
        });
    }

    get() {
        return this.size;
    }

    show() {
        this.$container.show();
    }

    hide() {
        this.$container.hide();
    }
}