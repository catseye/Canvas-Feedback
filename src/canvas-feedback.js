/*
 * Canvas Feedback -- "video feedback" in an HTML5 canvas
 * Copyright (c)2015-2016 Chris Pressey, Cat's Eye Technologies.
 * Distributed under an MIT license -- see this URL for full information:
 * https://github.com/catseye/canvas-feedback/blob/master/LICENSE
 */

function parseQuerystring(qs) {
    qs = qs || window.location.search.substring(1);
    var object = {};
    var pairs = qs.split('&');
    for (var i = 0; i < pairs.length; i++) {
        var components = pairs[i].split('=');
        var key = decodeURIComponent(components[0]);
        var value = decodeURIComponent(components[1]);
        object[key] = value;
    }
    return object;
}


function def(value, default_) {
    return value !== undefined ? value : default_;
}


function launch(prefix, containerId, config) {
    var config = config || {};
    var deps = [
        "element-factory.js",
        "animation.js",
        "preset-manager.js"
    ];
    var loaded = 0;
    for (var i = 0; i < deps.length; i++) {
        var elem = document.createElement('script');
        elem.src = prefix + deps[i];
        elem.onload = function() {
            if (++loaded < deps.length) return;

            config.rotationRate = def(config.rotationRate, 200);
            config.shrinkLeft = def(config.shrinkLeft, 1);
            config.shrinkRight = def(config.shrinkRight, 1);
            config.shrinkTop = def(config.shrinkTop, 1);
            config.shrinkBottom = def(config.shrinkBottom, 1);

            var qsArgs = parseQuerystring();
            if (qsArgs.imgUrl !== undefined) config.imgUrl = qsArgs.imgUrl;
            ['width', 'height', 'rotationRate',
             'shrinkLeft', 'shrinkRight', 'shrinkTop', 'shrinkBottom'].forEach(function(key) {
                if (qsArgs[key] !== undefined) {
                    config[key] = parseInt(qsArgs[key], 10);
                }
            });

            var container = document.getElementById(containerId);

            var t = new CanvasFeedback();

            var canvasContainer = yoob.makeDiv(container);
            canvasContainer.id = 'canvas_container';
            var canvas = yoob.makeCanvas(canvasContainer, 400, 400);
            config.canvas = canvas;

            var buttonPanel = yoob.makeDiv(canvasContainer);
            buttonPanel.id = 'button_panel';
            yoob.makeButton(buttonPanel, 'Restart', function() { t.reset(); });
            yoob.makeButton(buttonPanel, 'Pause', function() { t.pause(); });
            yoob.makeButton(buttonPanel, 'Resume', function() { t.resume(); });

            var controlPanel = yoob.makeDiv(container);
            controlPanel.id = 'control_panel';

            urlPanel = yoob.makePanel(controlPanel, "Image URL", false);
            var urlElem = yoob.makeTextInput(urlPanel, 32, config.imgUrl);
            yoob.makeButton(urlPanel, 'Load', function() {
                t.load(urlElem.value);
            });

            presetPanel = yoob.makePanel(controlPanel, "Select Preset", true);
            var presetSelect = yoob.makeSelect(presetPanel, "Preset:", []);

            var sliderPanel = yoob.makePanel(controlPanel, "Adjust Parameters", false);

            var rotateSlider = yoob.makeSliderPlusTextInput(
                sliderPanel, 'Rotate (microRadians):', -3000, 3000, 5,
                config.rotationRate,
                function(v) { t.rotationRate = v; }
            );
            yoob.makeLineBreak(sliderPanel);

            var shrinkLeftSlider = yoob.makeSliderPlusTextInput(
                sliderPanel, 'Shrink Left (pixels):', -200, 200, 5,
                config.shrinkLeft,
                function(v) { t.shrinkLeft = v; }
            );
            yoob.makeLineBreak(sliderPanel);

            var shrinkRightSlider = yoob.makeSliderPlusTextInput(
                sliderPanel, 'Shrink Right (pixels):', -200, 200, 5,
                config.shrinkRight,
                function(v) { t.shrinkRight = v; }
            );
            yoob.makeLineBreak(sliderPanel);

            var shrinkTopSlider = yoob.makeSliderPlusTextInput(
                sliderPanel, 'Shrink Top (pixels):', -200, 200, 5,
                config.shrinkTop,
                function(v) { t.shrinkTop = v; }
            );
            yoob.makeLineBreak(sliderPanel);

            var shrinkBottomSlider = yoob.makeSliderPlusTextInput(
                sliderPanel, 'Shrink Bottom (pixels):', -200, 200, 5,
                config.shrinkBottom,
                function(v) { t.shrinkBottom = v; }
            );
            yoob.makeLineBreak(sliderPanel);

            var p = new yoob.PresetManager();
            p.init({
                'selectElem': presetSelect
            });

            var presets = {
                "Rotate + Shrink ×1": {
                    rotate: 200,
                    shrink_left: 1,
                    shrink_right: 1,
                    shrink_top: 1,
                    shrink_bottom: 1
                },
                "Rotate + Shrink ×5": {
                    rotate: 1000,
                    shrink_left: 5,
                    shrink_right: 5,
                    shrink_top: 5,
                    shrink_bottom: 5
                },
                "Rotate + Shrink ×100": {
                    rotate: 4000,
                    shrink_left: 100,
                    shrink_right: 100,
                    shrink_top: 100,
                    shrink_bottom: 100
                },
                "Rotate + Shrink Horiz ×2": {
                    rotate: 500,
                    shrink_left: 2,
                    shrink_right: 2,
                    shrink_top: 0,
                    shrink_bottom: 0
                },
                "Rotate + Shrink Horiz ×100": {
                    rotate: 6000,
                    shrink_left: 100,
                    shrink_right: 100,
                    shrink_top: 0,
                    shrink_bottom: 0
                },
                "Rotate + Shrink Vert ×100": {
                    rotate: 6000,
                    shrink_left: 0,
                    shrink_right: 0,
                    shrink_top: 100,
                    shrink_bottom: 100
                },
                "Rotate + Expand ×1": {
                    rotate: 200,
                    shrink_left: -1,
                    shrink_right: -1,
                    shrink_top: -1,
                    shrink_bottom: -1
                },
                "Rotate Only": {
                    rotate: 200,
                    shrink_left: 0,
                    shrink_right: 0,
                    shrink_top: 0,
                    shrink_bottom: 0
                },
                "Blast off!": {
                    rotate: 700,
                    shrink_left: 0,
                    shrink_right: 7,
                    shrink_top: 0,
                    shrink_bottom: 5
                },
                "Cosmotic!": {
                    rotate: 1000,
                    shrink_left: -3,
                    shrink_right: 10,
                    shrink_top: -3,
                    shrink_bottom: -3
                },
                "Squash down": {
                    rotate: -4000,
                    shrink_left: -100,
                    shrink_right: -100,
                    shrink_top: 200,
                    shrink_bottom: 0
                },
                "Extremes": {
                    rotate: 2500,
                    shrink_left: -65,
                    shrink_right: 75,
                    shrink_top: -55,
                    shrink_bottom: 85
                },
                "Identity (No effect)": {
                    rotate: 0,
                    shrink_left: 0,
                    shrink_right: 0,
                    shrink_top: 0,
                    shrink_bottom: 0
                },
                "Shrink ×1": {
                    rotate: 0,
                    shrink_left: 1,
                    shrink_right: 1,
                    shrink_top: 1,
                    shrink_bottom: 1
                },
                "Expand ×1": {
                    rotate: 0,
                    shrink_left: -1,
                    shrink_right: -1,
                    shrink_top: -1,
                    shrink_bottom: -1
                },
                "Shrink Horiz ×1": {
                    rotate: 0,
                    shrink_left: 1,
                    shrink_right: 1,
                    shrink_top: 0,
                    shrink_bottom: 0
                },
                "Shrink Vert ×1": {
                    rotate: 0,
                    shrink_left: 0,
                    shrink_right: 0,
                    shrink_top: 1,
                    shrink_bottom: 1
                },
                "Shrink Horiz Expand Vert ×1": {
                    rotate: 0,
                    shrink_left: 1,
                    shrink_right: 1,
                    shrink_top: -1,
                    shrink_bottom: -1
                },
                "Shrink Vert Expand Horiz ×1": {
                    rotate: 0,
                    shrink_left: -1,
                    shrink_right: -1,
                    shrink_top: 1,
                    shrink_bottom: 1
                }
            };

            var setPreset = function(n) {
                var obj = presets[n];
                rotateSlider.set(obj.rotate);
                shrinkLeftSlider.set(obj.shrink_left);
                shrinkRightSlider.set(obj.shrink_right);
                shrinkTopSlider.set(obj.shrink_top);
                shrinkBottomSlider.set(obj.shrink_bottom);
            };

            for (n in presets) {
                p.add(n, setPreset);
            }

            t.init(config);
        };
        document.body.appendChild(elem);
    }
}


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

    this.load = function(url) {
        var $this = this;
        this.img.onload = function() {
            $this.reset();
        }
        this.img.src = url;
    };

    this.reset = function() {
        var width = this.width !== undefined ? this.width : this.img.width;
        var height = this.height !== undefined ? this.height : this.img.height;
        this.canvas.width = width;
        this.canvas.height = height;
        this.r = 0;
        this.ctx.drawImage(this.img, 0, 0, width, height);
        this.resume();
    };

    this.resume = function() {
        this.animation.start();
    };

    this.pause = function() {
        this.animation.stop();
    };
};
