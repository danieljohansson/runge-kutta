
var Plot = function (x, y) {
    this.width = 600;
    this.height = 400;
    this.markerSize = 5;
    
    this._axisEqual = false;
    this._axisScales = false;
    this._crosshairOn = false;
    
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    // store line data
    this.lines = [];
    
    this.setCtxTransform();
    
    if (x !== undefined && y !== undefined) {
        this.plot(x, y);
    }
};

Plot.prototype = {
    
    plot: function (x, y, color, marker, noLine) {
        if (!Array.isArray(x) || !Array.isArray(y)) {
            throw new TypeError('Parameters "x" and "y" must be arrays.');
        }
        if (x.length !== y.length) {
            throw new Error('Arrays "x" and "y" must be of equal length.');
        }
        if (x.length > 1e4) {
            x.splice(1e4, x.length);
            y.splice(1e4, y.length);
            console.warn('Too many data points. First 10000 plotted.');
        }
        
        var line = {
            x: this.onlyNumbers(x),
            y: this.onlyNumbers(y),
            color: color,
            marker: marker,
            noLine: noLine
        };
        this.lines.push(line);
        
        this.render();
        
        return this;
    },
    
    onlyNumbers: function (x) {
        var i, len = x.length;
        for (i = 0; i < len; i++) {
            // Set non numbers and NaN to null
            if (typeof x[i] !== 'number' || x[i] !== x[i]) {
                x[i] = null;
                console.warn('Non numeric values in data set.');
            }
        }
        return x;
    },
    
    setCtxTransform: function () {
        var borderTop = 15, borderRight = 15, borderBottom = 15, borderLeft = 15;
        if (this._axisOn) {
            borderBottom += 30;
            borderLeft += 50;
        }
        this.canvas.width = this.width + borderLeft + borderRight;
        this.canvas.height = this.height + borderTop + borderBottom;
        this.ctx.translate(borderLeft, this.height + borderTop);
        this.ctx.scale(1, -1);
    },
    
    render: function () {
        this.updateViewport();
        
        // Paint white background
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
        this.ctx.restore();
        
        if (this._crosshairOn) {
            this.drawCrosshair();
        }
        if (this._axisOn) {
            this.ctx.font = '15px Calibri, sans-serif';
            this.ctx.fillStyle = 'black';
            this.drawXAxis();
            this.drawYAxis();
        }
        
        // Draw lines
        for (var j = 0; j < this.lines.length; j++) {
            this.drawLine(this.lines[j]);
        }
    },
    
    updateViewport: function () {
        var j, len = this.lines.length;
        var xMax, xMin, yMax, yMin;
        
        for (j = 0; j < len; j++) {
            
            xMax = Math.max.apply(this, this.lines[j].x);
            xMin = Math.min.apply(this, this.lines[j].x);
            yMax = Math.max.apply(this, this.lines[j].y);
            yMin = Math.min.apply(this, this.lines[j].y);
            
            if (j === 0 || xMax > this.xMax) { this.xMax = xMax; }
            if (j === 0 || xMin < this.xMin) { this.xMin = xMin; }
            if (j === 0 || yMax > this.yMax) { this.yMax = yMax; }
            if (j === 0 || yMin < this.yMin) { this.yMin = yMin; }
        }
        
        if (this._axisEqual) {
            var xSpan = this.xMax - this.xMin;
            var ySpan = this.yMax - this.yMin;
            var xMid = this.xMin + xSpan / 2;
            var yMid = this.yMin + ySpan / 2;
            
            // minimum pixels per length
            var scale = Math.min(this.width / xSpan, this.height / ySpan);
            
            this.xMin = xMid - 0.5 * this.width / scale;
            this.xMax = xMid + 0.5 * this.width / scale;
            this.yMin = yMid - 0.5 * this.height / scale;
            this.yMax = yMid + 0.5 * this.height / scale;
        }
    },
    
    circleMarkerAt: function (x, y) {
        var size = this.markerSize;
        this.ctx.moveTo(x + size, y);
        this.ctx.arc(x, y, size, 0, Math.PI*2, true);
        this.ctx.moveTo(x, y);
    },
    
    plusMarkerAt: function (x, y) {
        var size = this.markerSize;
        this.ctx.moveTo(Math.ceil(x) - size - 1, Math.ceil(y) + 0.5);
        this.ctx.lineTo(Math.ceil(x) + size, Math.ceil(y) + 0.5);
        this.ctx.moveTo(Math.ceil(x) - 0.5, Math.ceil(y) - size);
        this.ctx.lineTo(Math.ceil(x) - 0.5, Math.ceil(y) + size + 1);
        this.ctx.moveTo(x, y);
    },
    
    xMarkerAt: function (x, y) {
        var size = this.markerSize;
        this.ctx.moveTo(Math.round(x) - size + 1, Math.round(y) - size + 1);
        this.ctx.lineTo(Math.round(x) + size - 1, Math.round(y) + size - 1);
        this.ctx.moveTo(Math.round(x) - size + 1, Math.round(y) + size - 1);
        this.ctx.lineTo(Math.round(x) + size - 1, Math.round(y) - size + 1);
        this.ctx.moveTo(x, y);
    },
    
    boxMarkerAt: function (x, y) {
        var size = this.markerSize;
        this.ctx.rect(Math.round(x) + 0.5 - size, Math.round(y) + 0.5 - size, 2*size - 1, 2*size - 1);
        this.ctx.moveTo(x, y);
    },
    
    drawLine: function (line) {
        
        // make copy to leave original intact
        var x = line.x.slice();
        var y = line.y.slice();
        var i, len = x.length;
        var lastWasNull = false;
        
        // adjust to plot size
        for (i = 0; i < len; i++) {
            if (x[i] !== null) {
                x[i] = (x[i] - this.xMin) / (this.xMax - this.xMin) * this.width;
            }
            if (y[i] !== null) {
                y[i] = (y[i] - this.yMin) / (this.yMax - this.yMin) * this.height;
            }
        }
        
        var markers = {
            'o': 'circleMarkerAt',
            'x': 'xMarkerAt',
            '+': 'plusMarkerAt',
            'box': 'boxMarkerAt'
        };
        this.ctx.beginPath();
        this.ctx.moveTo(x[0], y[0]);
        
        for (i = 0; i < len; i++) {
            if (x[i] === null || y[i] === null) {
                lastWasNull = true;
            }
            else {
                if (lastWasNull) {
                    this.ctx.moveTo(x[i], y[i]);
                }
                else if (!line.noLine) {
                    this.ctx.lineTo(x[i], y[i]);
                }
                if (markers.hasOwnProperty(line.marker)) {
                    this[markers[line.marker]](x[i], y[i]);
                }
                lastWasNull = false;
            }
        }
        
        this.ctx.strokeStyle = line.color || 'black';
        this.ctx.stroke();
    },
    
    setSize: function (width, height) {
        // canvas width = width + borders width
        if (width > 0 && height > 0) {
            this.width = width;
            this.height = height;
            this.setCtxTransform();
            this.render();
        }
        return this;
    },
    
    axisEqual: function (bool) {
        this._axisEqual = (bool === undefined ? true : bool);
        this.render();
        return this;
    },
    
    crosshairOn: function () {
        this._crosshairOn = true;
        this.render();
        return this;
    },
    
    drawCrosshair: function () {
        if (this.xMin <= 0 && 0 <= this.xMax) {
            this.drawLine({
                x: [0, 0], 
                y: [this.yMin, this.yMax], 
                color: 'lightgray'
            });
        }
        if (this.yMin <= 0 && 0 <= this.yMax) {
            this.drawLine({
                x: [this.xMin, this.xMax], 
                y: [0, 0], 
                color: 'lightgray'
            });
        }
    },
    
    axisOn: function () {
        this._axisOn = true;
        this.setCtxTransform();
        this.render();
        return this;
    },
    
    getScales: function (min, max) {
        var log10 = function (x) { return Math.log(x)/Math.log(10); };
        var keepEveryNth = function (arr, n) {
            var keep = [];
            for (var i = 0; i < arr.length; i += n) {
                keep.push(arr[i]);
            }
            return keep;
        };
        var absMax = Math.max(Math.abs(min), Math.abs(max));
        var magn = Math.pow(10, Math.floor(log10(absMax)));
        var a = Math.ceil(min / magn);
        var b = Math.floor(max / magn);
        var scales = [];
        
        if (b - a < 5) {
            magn = magn / 10;
            a = Math.ceil(min / magn);
            b = Math.floor(max / magn);
        }
        
        for (var i = 0; i < b - a + 1; i++) {
            // (1/magn) to avoid some trailing decimals
            scales.push((a + i)/(1/magn));
        }
        
        if (b - a > 10) {
            scales = keepEveryNth(scales, Math.ceil((b - a)/10));
        }
        
        return scales;
    },
    
    drawXAxis: function () {
        var scales = this.getScales(this.xMin, this.xMax);
        var x, y = -12.5;
        var i, len = scales.length;
        var size = 5;
        
        this.ctx.beginPath();
        this.ctx.moveTo(-13, y);
        this.ctx.lineTo(this.width, y);
        this.ctx.textAlign = 'center';
        
        for (i = 0; i < len; i++) {
            // adjust to plot size
            x = (scales[i] - this.xMin) / (this.xMax - this.xMin) * this.width;
            
            this.ctx.moveTo(Math.ceil(x) - 0.5, Math.ceil(y) - size);
            this.ctx.lineTo(Math.ceil(x) - 0.5, Math.ceil(y));
            
            this.ctx.save();
            this.ctx.scale(1, -1);
            this.ctx.fillText(scales[i], x, -y + 20);
            this.ctx.restore();
        }
        this.ctx.strokeStyle = 'black';
        this.ctx.stroke();
    },
    
    drawYAxis: function () {
        var scales = this.getScales(this.yMin, this.yMax);
        var y, x = -12.5;
        var i, len = scales.length;
        var size = 5;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, -13);
        this.ctx.lineTo(x, this.height);
        this.ctx.textAlign = 'right';
        
        for (i = 0; i < len; i++) {
            // adjust to plot size
            y = (scales[i] - this.yMin) / (this.yMax - this.yMin) * this.height;
            
            this.ctx.moveTo(Math.ceil(x) - size, Math.ceil(y) - 0.5);
            this.ctx.lineTo(Math.ceil(x), Math.ceil(y) - 0.5);
            
            this.ctx.save();
            this.ctx.scale(1, -1);
            this.ctx.fillText(scales[i], x - 12, -y + 4);
            this.ctx.restore();
        }
        this.ctx.strokeStyle = 'black';
        this.ctx.stroke();
    }
};
