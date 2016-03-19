/// <reference path="../_all.d.ts" />

class Threshold extends EventEmitter {
    private size = 5;
    private $elem = $('#threshold');
    private $container = this.$elem.parent();

    constructor() {
        super();
        this.$elem.val(this.size);
        this.addEventListeners();
    }

    private addEventListeners() {
        var self = this;
        this.$elem.on('input', function() {
            console.log(2);
            self.size = +this.value;
            self.emit('change', { threshold: +this.value });
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