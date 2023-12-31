(function($) {
    let fwTextOverlay = {};
    fwTextOverlay.opacityIn = [0,1];
    fwTextOverlay.scaleIn = [0.2, 1];
    fwTextOverlay.scaleOut = 3;
    fwTextOverlay.durationIn = 1600;
    fwTextOverlay.durationOut = 1600;
    fwTextOverlay.delay = 1600;

    setTimeout(function () {
        anime.timeline({loop: false})
            .add({
                targets: '.fw-text-overlay .letters-1',
                opacity: fwTextOverlay.opacityIn,
                scale: fwTextOverlay.scaleIn,
                duration: fwTextOverlay.durationIn
            }).add({
            targets: '.fw-text-overlay .letters-1',
            opacity: 0,
            scale: fwTextOverlay.scaleOut,
            duration: fwTextOverlay.durationOut,
            easing: "easeInExpo",
            delay: fwTextOverlay.delay
        }).add({
            targets: '.fw-text-overlay .letters-2',
            opacity: fwTextOverlay.opacityIn,
            scale: fwTextOverlay.scaleIn,
            duration: fwTextOverlay.durationIn
        }).add({
            targets: '.fw-text-overlay .letters-2',
            opacity: 0,
            scale: fwTextOverlay.scaleOut,
            duration: fwTextOverlay.durationOut,
            easing: "easeInExpo",
            delay: fwTextOverlay.delay
        }).add({
            targets: '.fw-text-overlay .letters-3',
            opacity: fwTextOverlay.opacityIn,
            scale: fwTextOverlay.scaleIn,
            duration: fwTextOverlay.durationIn
        }).add({
            targets: '.fw-text-overlay .letters-3',
            opacity: 0,
            scale: fwTextOverlay.scaleOut,
            duration: fwTextOverlay.durationOut,
            easing: "easeInExpo",
            delay: fwTextOverlay.delay
        }).add({
            targets: '.fw-text-overlay',
            opacity: 0,
            duration: 500,
            delay: 500
        });
    }, 1000);
}(jQuery));

(function($) {
    let Fireworks;
    Fireworks = function () {
        let self = this;
        let rand = function (rMi, rMa) {
            return ~~((Math.random() * (rMa - rMi + 1)) + rMi);
        };
        let hitTest = function (x1, y1, w1, h1, x2, y2, w2, h2) {
            return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);
        };
        window.requestAnimFrame = function () {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (a) {
                window.setTimeout(a, 1E3 / 60)
            }
        }();
      
        self.init = function () {
            self.dt = 0;
            self.oldTime = Date.now();
            self.canvas = document.createElement('canvas');
            self.canvasContainer = $('#canvas-container');

            let canvasContainerDisabled = document.getElementById('canvas-container');
            self.canvas.onselectstart = function () {
                return false;
            };

            self.canvas.width = self.cw = 1600;
            self.canvas.height = self.ch = 900;

            self.particles = [];
            self.partCount = 500;
            self.fireworks = [];
            self.mx = self.cw / 2;
            self.my = self.ch / 2;
            self.currentHue = 67;
            self.partSpeed = 6;
            self.partSpeedVariance = 11;
            self.partWind = 20;
            self.partFriction = 10;
            self.partGravity = 3;
            self.hueMin = 67;
            self.hueMax = 83;
            self.fworkSpeed = 3;
            self.fworkAccel = 3;
            self.hueVariance = 58;
            self.flickerDensity = 33;
            self.showShockwave = true;
            self.showTarget = false;
            self.clearAlpha = 50;
            self.canvasContainer.append(self.canvas);
            self.ctx = self.canvas.getContext('2d');
            self.ctx.lineCap = 'round';
            self.ctx.lineJoin = 'round';
            self.lineWidth = 1;
            self.bindEvents();
            self.canvasLoop();
            self.canvas.onselectstart = function () {
                return false;
            };
        };

        let Particle = function (x, y, hue) {
            this.x = x;
            this.y = y;
            this.coordLast = [
                {x: x, y: y},
                {x: x, y: y},
                {x: x, y: y}
            ];
            this.angle = rand(0, 360);
            this.speed = rand(((self.partSpeed - self.partSpeedVariance) <= 0) ? 1 : self.partSpeed - self.partSpeedVariance, (self.partSpeed + self.partSpeedVariance));
            this.friction = 1 - self.partFriction / 100;
            this.gravity = self.partGravity / 2;
            this.hue = rand(hue - self.hueVariance, hue + self.hueVariance);
            this.brightness = rand(50, 80);
            this.alpha = rand(40, 100) / 100;
            this.decay = rand(10, 50) / 1000;
            this.wind = (rand(0, self.partWind) - (self.partWind / 2)) / 25;
            this.lineWidth = self.lineWidth;
        };

        Particle.prototype.update = function (index) {
            let radians = this.angle * Math.PI / 180;
            let vx = Math.cos(radians) * this.speed;
            let vy = Math.sin(radians) * this.speed + this.gravity;
            this.speed *= this.friction;

            this.coordLast[2].x = this.coordLast[1].x;
            this.coordLast[2].y = this.coordLast[1].y;
            this.coordLast[1].x = this.coordLast[0].x;
            this.coordLast[1].y = this.coordLast[0].y;
            this.coordLast[0].x = this.x;
            this.coordLast[0].y = this.y;

            this.x += vx * self.dt;
            this.y += vy * self.dt;

            this.angle += this.wind;
            this.alpha -= this.decay;

            if (!hitTest(0, 0, self.cw, self.ch, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2) || this.alpha < .05) {
                self.particles.splice(index, 1);
            }
        };

        Particle.prototype.draw = function () {
            let coordRand = (rand(1, 3) - 1);
            self.ctx.beginPath();
            self.ctx.moveTo(Math.round(this.coordLast[coordRand].x), Math.round(this.coordLast[coordRand].y));
            self.ctx.lineTo(Math.round(this.x), Math.round(this.y));
            self.ctx.closePath();
            self.ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
            self.ctx.stroke();

            if (self.flickerDensity > 0) {
                let inverseDensity = 50 - self.flickerDensity;
                if (rand(0, inverseDensity) === inverseDensity) {
                    self.ctx.beginPath();
                    self.ctx.arc(Math.round(this.x), Math.round(this.y), rand(this.lineWidth, this.lineWidth + 3) / 2, 0, Math.PI * 2, false)
                    self.ctx.closePath();
                    let randAlpha = rand(50, 100) / 100;
                    self.ctx.fillStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + randAlpha + ')';
                    self.ctx.fill();
                }
            }
        };
        self.createParticles = function (x, y, hue) {
            let countdown = self.partCount;
            while (countdown--) {
                self.particles.push(new Particle(x, y, hue));
            }
        };
        self.updateParticles = function () {
            let i = self.particles.length;
            while (i--) {
                let p = self.particles[i];
                p.update(i);
            }
        };
        self.drawParticles = function () {
            let i = self.particles.length;
            while (i--) {
                let p = self.particles[i];
                p.draw();
            }
        };
        let Firework = function (startX, startY, targetX, targetY) {
            this.x = startX;
            this.y = startY;
            this.startX = startX;
            this.startY = startY;
            this.hitX = false;
            this.hitY = false;
            this.coordLast = [
                {x: startX, y: startY},
                {x: startX, y: startY},
                {x: startX, y: startY}
            ];
            this.targetX = targetX;
            this.targetY = targetY;
            this.speed = self.fworkSpeed;
            this.angle = Math.atan2(targetY - startY, targetX - startX);
            this.shockwaveAngle = Math.atan2(targetY - startY, targetX - startX) + (90 * (Math.PI / 180));
            this.acceleration = self.fworkAccel / 100;
            this.hue = self.currentHue;
            this.brightness = rand(50, 80);
            this.alpha = rand(50, 100) / 100;
            this.lineWidth = self.lineWidth;
            this.targetRadius = 1;
        };

        Firework.prototype.update = function (index) {
            self.ctx.lineWidth = this.lineWidth;

            let vx = Math.cos(this.angle) * this.speed;
            let vy = Math.sin(this.angle) * this.speed;
            this.speed *= 1 + this.acceleration;
            this.coordLast[2].x = this.coordLast[1].x;
            this.coordLast[2].y = this.coordLast[1].y;
            this.coordLast[1].x = this.coordLast[0].x;
            this.coordLast[1].y = this.coordLast[0].y;
            this.coordLast[0].x = this.x;
            this.coordLast[0].y = this.y;

            if (self.showTarget) {
                if (this.targetRadius < 8) {
                    this.targetRadius += .25 * self.dt;
                } else {
                    this.targetRadius = 1 * self.dt;
                }
            }

            if (this.startX >= this.targetX) {
                if (this.x + vx <= this.targetX) {
                    this.x = this.targetX;
                    this.hitX = true;
                } else {
                    this.x += vx * self.dt;
                }
            } else {
                if (this.x + vx >= this.targetX) {
                    this.x = this.targetX;
                    this.hitX = true;
                } else {
                    this.x += vx * self.dt;
                }
            }

            if (this.startY >= this.targetY) {
                if (this.y + vy <= this.targetY) {
                    this.y = this.targetY;
                    this.hitY = true;
                } else {
                    this.y += vy * self.dt;
                }
            } else {
                if (this.y + vy >= this.targetY) {
                    this.y = this.targetY;
                    this.hitY = true;
                } else {
                    this.y += vy * self.dt;
                }
            }

            if (this.hitX && this.hitY) {
                let randExplosion = rand(0, 9);
                self.createParticles(this.targetX, this.targetY, this.hue);
                self.fireworks.splice(index, 1);
            }
        };

        Firework.prototype.draw = function () {
            self.ctx.lineWidth = this.lineWidth;

            let coordRand = (rand(1, 3) - 1);
            self.ctx.beginPath();
            self.ctx.moveTo(Math.round(this.coordLast[coordRand].x), Math.round(this.coordLast[coordRand].y));
            self.ctx.lineTo(Math.round(this.x), Math.round(this.y));
            self.ctx.closePath();
            self.ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
            self.ctx.stroke();

            if (self.showTarget) {
                self.ctx.save();
                self.ctx.beginPath();
                self.ctx.arc(Math.round(this.targetX), Math.round(this.targetY), this.targetRadius, 0, Math.PI * 2, false)
                self.ctx.closePath();
                self.ctx.lineWidth = 1;
                self.ctx.stroke();
                self.ctx.restore();
            }

            if (self.showShockwave) {
                self.ctx.save();
                self.ctx.translate(Math.round(this.x), Math.round(this.y));
                self.ctx.rotate(this.shockwaveAngle);
                self.ctx.beginPath();
                self.ctx.arc(0, 0, (this.speed / 5), 0, Math.PI, true);
                self.ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + rand(25, 60) / 100 + ')';
                self.ctx.lineWidth = this.lineWidth;
                self.ctx.stroke();
                self.ctx.restore();
            }
        };
        self.createFireworks = function (startX, startY, targetX, targetY) {
            self.fireworks.push(new Firework(startX, startY, targetX, targetY));
        };
        self.updateFireworks = function () {
            let i = self.fireworks.length;
            while (i--) {
                let f = self.fireworks[i];
                f.update(i);
            }
        };
        self.drawFireworks = function () {
            let i = self.fireworks.length;
            while (i--) {
                let f = self.fireworks[i];
                f.draw();
            }
        };
        self.bindEvents = function () {
            $(window).on('resize', function () {
                clearTimeout(self.timeout);
                self.timeout = setTimeout(function () {
                    self.ctx.lineCap = 'round';
                    self.ctx.lineJoin = 'round';
                }, 100);
            });

            $(self.canvas).on('mousedown', function (e) {
                let randLaunch = rand(0, 5);
                self.mx = e.pageX - self.canvasContainer.offset().left;
                self.my = e.pageY - self.canvasContainer.offset().top;
                self.currentHue = rand(self.hueMin, self.hueMax);
                self.createFireworks(self.cw / 2, self.ch, self.mx, self.my);

                $(self.canvas).on('mousemove.fireworks', function (e) {
                    let randLaunch = rand(0, 5);
                    self.mx = e.pageX - self.canvasContainer.offset().left;
                    self.my = e.pageY - self.canvasContainer.offset().top;
                    self.currentHue = rand(self.hueMin, self.hueMax);
                    self.createFireworks(self.cw / 2, self.ch, self.mx, self.my);
                });
            });

            $(self.canvas).on('mouseup', function (e) {
                $(self.canvas).off('mousemove.fireworks');
            });
        };
        self.clear = function () {
            self.particles = [];
            self.fireworks = [];
            self.ctx.clearRect(0, 0, self.cw, self.ch);
        };
        self.updateDelta = function () {
            let newTime = Date.now();
            self.dt = (newTime - self.oldTime) / 16;
            self.dt = (self.dt > 5) ? 5 : self.dt;
            self.oldTime = newTime;
        };
        self.canvasLoop = function () {
            requestAnimFrame(self.canvasLoop, self.canvas);
            self.updateDelta();
            self.ctx.globalCompositeOperation = 'destination-out';
            self.ctx.fillStyle = 'rgba(0,0,0,' + self.clearAlpha / 100 + ')';
            self.ctx.fillRect(0, 0, self.cw, self.ch);
            self.ctx.globalCompositeOperation = 'lighter';
            self.updateFireworks();
            self.updateParticles();
            self.drawFireworks();
            self.drawParticles();
        };

        self.init();

        let initialLaunchCount = 120;
        while (initialLaunchCount--) {
            setTimeout(function () {
                self.fireworks.push(new Firework(self.cw / 2, self.ch, rand(80, self.cw - 50), rand(50, self.ch / 2) - 50));
            }, initialLaunchCount * 200);
        }
    };
    let guiPresets = {
        "preset": "Default",
        "remembered": {
            "Default": {
                "0": {
                    "fworkSpeed": 2,
                    "fworkAccel": 3,
                    "showShockwave": true,
                    "showTarget": false,
                    "partCount": 30,
                    "partSpeed": 5,
                    "partSpeedVariance": 10,
                    "partWind": 50,
                    "partFriction": 5,
                    "partGravity": 1,
                    "flickerDensity": 20,
                    "hueMin": 150,
                    "hueMax": 200,
                    "hueVariance": 30,
                    "lineWidth": 1,
                    "clearAlpha": 25
                }
            }
        },
        "closed": true,
        "folders": {
            "Fireworks": {
                "preset": "Default",
                "closed": false,
                "folders": {}
            },
            "Particles": {
                "preset": "Default",
                "closed": true,
                "folders": {}
            },
            "Color": {
                "preset": "Default",
                "closed": true,
                "folders": {}
            },
            "Other": {
                "preset": "Default",
                "closed": true,
                "folders": {}
            }
        }
    };
    let fworks = new Fireworks();
    let gui = new dat.GUI({
        autoPlace: false,
        load: guiPresets,
        preset: 'Default'
    });
    let customContainer = document.getElementById('gui');
    customContainer.appendChild(gui.domElement);

    let guiFireworks = gui.addFolder('Fireworks');
    guiFireworks.add(fworks, 'fworkSpeed').min(1).max(10).step(1);
    guiFireworks.add(fworks, 'fworkAccel').min(0).max(50).step(1);
    guiFireworks.add(fworks, 'showShockwave');
    guiFireworks.add(fworks, 'showTarget');

    let guiParticles = gui.addFolder('Particles');
    guiParticles.add(fworks, 'partCount').min(0).max(500).step(1);
    guiParticles.add(fworks, 'partSpeed').min(1).max(100).step(1);
    guiParticles.add(fworks, 'partSpeedVariance').min(0).max(50).step(1);
    guiParticles.add(fworks, 'partWind').min(0).max(100).step(1);
    guiParticles.add(fworks, 'partFriction').min(0).max(50).step(1);
    guiParticles.add(fworks, 'partGravity').min(-20).max(20).step(1);
    guiParticles.add(fworks, 'flickerDensity').min(0).max(50).step(1);

    let guiColor = gui.addFolder('Color');
    guiColor.add(fworks, 'hueMin').min(0).max(360).step(1);
    guiColor.add(fworks, 'hueMax').min(0).max(360).step(1);
    guiColor.add(fworks, 'hueVariance').min(0).max(180).step(1);

    let guiOther = gui.addFolder('Other');
    guiOther.add(fworks, 'lineWidth').min(1).max(20).step(1);
    guiOther.add(fworks, 'clearAlpha').min(0).max(100).step(1);
    guiOther.add(fworks, 'clear').name('Clear');

    gui.remember(fworks);

}(jQuery));