class ColorManager {
    private color = '#000000';
    private $elem = $('#color');
    private $container = this.$elem.parent();

    constructor() {
        this.$elem.val(this.color);
        this.addEventListeners();
    }

    addEventListeners() {
        var self = this;
        this.$elem.on('keyup', function() {
            self.color = this.value;
        });
    }

    get() {
        return this.color;
    }

    show() {
        this.$container.show();
    }
    
    hide() {
        this.$container.hide();
    }
}