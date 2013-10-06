
//*/
var f = function (t) { return Math.exp(t); };
var exact = function (t) { return Math.exp(t); };
//*/
/*/
var f = function (t) { return t*Math.sin(t); };
var exact = function (t) { return Math.sin(t) + t*Math.cos(t); };
//*/

var p = new Plot().options({
    width: 700, 
    height: 500,
    markerSize: 4,
    axes: true
});

var t = 1;
var diff1 = [];
var diff2 = [];
var diff4 = [];
var diff6 = [];

var n = 4*15 + 1;
var logs = logspace(-15, 0, n);

for (var i = 0; i < n; i++) {
    diff1[i] = Math.log(Math.abs(exact(t) - diff(f, t, logs[i], 1)));
    diff2[i] = Math.log(Math.abs(exact(t) - diff(f, t, logs[i], 2)));
    diff4[i] = Math.log(Math.abs(exact(t) - diff(f, t, logs[i], 4)));
    diff6[i] = Math.log(Math.abs(exact(t) - diff(f, t, logs[i], 6)));
}

p.plot(linspace(0, 15, n), diff1, {color: 'red', marker: 'o'});
p.plot(linspace(0, 15, n), diff2, {color: 'green', marker: 'box'});
p.plot(linspace(0, 15, n), diff4, {color: 'orange', marker: '+'});
p.plot(linspace(0, 15, n), diff6, {color: 'purple', marker: 'x'});
