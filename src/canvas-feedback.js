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

            var container = document.getElementById(containerId);

            var t = new CanvasFeedback();

            var canvas = yoob.makeCanvas(container, 400, 400);
            canvas.style.background = "white";
            canvas.style.border = "1px solid black";
            config.canvas = canvas;

            var controlPanel = config.controlPanel || container;

            yoob.makeButton(controlPanel, 'Restart', function() { t.reset(); });
            yoob.makeButton(controlPanel, 'Pause', function() { t.pause(); });
            yoob.makeButton(controlPanel, 'Resume', function() { t.resume(); });
            yoob.makeLineBreak(controlPanel);

            var stylePanel = function(panel) {
                panel.style.background = "#e0e0e0";
                panel.style.padding = "3px";
                panel.parentNode.style.background = "#c0c0c0";
                panel.parentNode.style.textAlign = "left";
            };

            urlPanel = yoob.makePanel(controlPanel, "Image URL", false);
            var urlElem = yoob.makeTextInput(urlPanel, 64, config.imgUrl);
            urlElem.style.width = "80%";
            yoob.makeButton(urlPanel, 'Load', function() {
                t.load(urlElem.value);
            });
            stylePanel(urlPanel);

            presetPanel = yoob.makePanel(controlPanel, "Select Preset", true);
            var presetSelect = yoob.makeSelect(presetPanel, "Preset:", []);
            stylePanel(presetPanel);

            var sliderPanel = yoob.makePanel(controlPanel, "Adjust Parameters", false);
            sliderPanel.style.textAlign = "right";
            stylePanel(sliderPanel);

            var rotateSlider = yoob.makeSliderPlusTextInput(
                sliderPanel, 'Rotate (microRadians):', -3000, 3000, 5, 200,
                function(v) { t.rotationRate = v; }
            );
            rotateSlider.textInput.style.width = "auto";
            yoob.makeLineBreak(sliderPanel);

            var shrinkLeftSlider = yoob.makeSliderPlusTextInput(
                sliderPanel, 'Shrink Left (pixels):', -200, 200, 5, 1,
                function(v) { t.shrinkLeft = v; }
            );
            shrinkLeftSlider.textInput.style.width = "auto";
            yoob.makeLineBreak(sliderPanel);

            var shrinkRightSlider = yoob.makeSliderPlusTextInput(
                sliderPanel, 'Shrink Right (pixels):', -200, 200, 5, 1,
                function(v) { t.shrinkRight = v; }
            );
            shrinkRightSlider.textInput.style.width = "auto";
            yoob.makeLineBreak(sliderPanel);

            var shrinkTopSlider = yoob.makeSliderPlusTextInput(
                sliderPanel, 'Shrink Top (pixels):', -200, 200, 5, 1,
                function(v) { t.shrinkTop = v; }
            );
            shrinkTopSlider.textInput.style.width = "auto";
            yoob.makeLineBreak(sliderPanel);

            var shrinkBottomSlider = yoob.makeSliderPlusTextInput(
                sliderPanel, 'Shrink Bottom (pixels):', -200, 200, 5, 1,
                function(v) { t.shrinkBottom = v; }
            );
            shrinkBottomSlider.textInput.style.width = "auto";
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
    var canvas;
    var ctx;

    var img = new Image();
    var r = 0;

    this.centerX = 200;
    this.centerY = 200;
    this.unCenterX = -200;
    this.unCenterY = -200;
    this.rotationRate = 200;

    this.shrinkLeft = 1;
    this.shrinkRight = 1;
    this.shrinkTop = 1;
    this.shrinkBottom = 1;

    this.draw = function() {
        ctx.save();
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(r);
        ctx.translate(this.unCenterX, this.unCenterY);
        r += this.rotationRate / 1000000;
        ctx.drawImage(canvas,
            this.shrinkLeft, this.shrinkTop,
            canvas.width - this.shrinkLeft - this.shrinkRight,
            canvas.height - this.shrinkTop - this.shrinkBottom);
        ctx.restore();
    };

    this.update = function() {
    };

    this.load = function(url) {
        var self = this;
        img.onload = function() {
            self.reset();
        }
        img.src = url;
    };

    this.reset = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        this.centerX = img.width / 2;
        this.centerY = img.height / 2;
        this.unCenterX = -1 * this.centerX;
        this.unCenterY = -1 * this.centerY;
        r = 0;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        this.resume();
    };

    this.resume = function() {
        this.animation.start();
    };

    this.pause = function() {
        this.animation.stop();
    };

    this.init = function(cfg) {
        canvas = cfg.canvas;
        ctx = canvas.getContext("2d");
        var $this = this;

        this.animation = (new yoob.Animation()).init({
            'object': this,
            'mode': 'quantum'
        });
        this.animation.start();
        
        img.onload = function() {
            $this.reset();
        }
        img.src = cfg.imgUrl;
    };
};
