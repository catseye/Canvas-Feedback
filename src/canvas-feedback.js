/*
 * Canvas Feedback -- "video feedback" in an HTML5 canvas
 * Copyright (c)2015-2018 Chris Pressey, Cat's Eye Technologies.
 * Distributed under an MIT license -- see this URL for full information:
 * https://github.com/catseye/canvas-feedback/blob/master/LICENSE
 */

/*
 * Requires yoob.Animation to be loaded first.
 */

CanvasFeedback = function() {

    this.init = function(cfg) {
        this.canvas = cfg.canvas;
        this.ctx = this.canvas.getContext("2d");

        this.img = new Image();
        this.r = 0;

        this.width = cfg.width;
        this.height = cfg.height;
        this.rotationRate = def(cfg.rotationRate, 200);

        this.shrinkLeft = def(cfg.shrinkLeft, 1);
        this.shrinkRight = def(cfg.shrinkRight, 1);
        this.shrinkTop = def(cfg.shrinkTop, 1);
        this.shrinkBottom = def(cfg.shrinkBottom, 1);

        var $this = this;

        this.animation = (new yoob.Animation()).init({
            'object': $this,
            'mode': 'quantum'
        });
        this.animation.start();
        
        this.img.onload = function() {
            $this.reset();
        }
        this.img.src = cfg.imgUrl;
    };

    this.draw = function() {
        var ctx = this.ctx;
        var width = this.canvas.width;
        var height = this.canvas.height;
        var centerX = width / 2;
        var centerY = height / 2;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.r);
        ctx.translate(-1 * centerX, -1 * centerY);
        this.r += this.rotationRate / 1000000;
        ctx.drawImage(this.canvas,
            this.shrinkLeft, this.shrinkTop,
            this.canvas.width - this.shrinkLeft - this.shrinkRight,
            this.canvas.height - this.shrinkTop - this.shrinkBottom);
        ctx.restore();
    };

    this.update = function() {
    };

    this.loadImage = function(url) {
        var $this = this;
        this.img.onload = function() {
            $this.reset();
        }
        this.img.src = url;
    };

    this.reset = function() {
        // assumed to only be called after a (new) image is loaded.
        if (this.width === undefined) this.width = this.img.width;
        if (this.height === undefined) this.height = this.img.height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.r = 0;
        this.ctx.drawImage(this.img, 0, 0, this.width, this.height);
        this.resume();
    };

    this.resume = function() {
        this.animation.start();
    };

    this.pause = function() {
        this.animation.stop();
    };
};
