/// <reference path="_all.d.ts" />

interface ICursorConfig {
    radius?: number;
    url?: string;
    color?: string;
    top?: number;
    left?: number;
}

class CustomCursor {
    private canvas = document.createElement('canvas');
    private ctx = this.canvas.getContext('2d');
    private radius = 4;
    private color = '#000';
    private url: string;
    private top: number;
    private left: number;

    constructor(config?: ICursorConfig) {
        this.set(config || {});
    }

    set(config: ICursorConfig) {
        $.extend(this, config);
        this.activate();
    }

    activate() {
        if (this.url) {
            this.getFromUrl();
        } else {
            this.renderCursor();
            this.createURL();
        }
    }

    private renderCursor() {
        var radius = this.radius / 2; // ??
        var color = this.color;
        var ctx = this.ctx;

        this.canvas.width = 2 * radius;
        this.canvas.height = 2 * radius;

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = '#000';

        ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    private createURL() {
        var url = this.canvas.toDataURL();
        this.createCssUrl(url, this.radius / 2, this.radius / 2, "crosshair");
    }

    private getFromUrl() {
        this.createCssUrl(this.url, this.left, this.top, "crosshair");
    }

    private createCssUrl(url, left, top, _default) {
        var cssURL = "url('" + url + "')" + left + ' ' + top + ", " + _default;
        this.setCursorFromURL(cssURL);        
    }

    private setCursorFromURL(url) {
        document.body.style.cursor = url;
    }
}