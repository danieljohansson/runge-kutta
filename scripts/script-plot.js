//*/

var f1 = function (x) { return x*x*x - x; };
var f2 = function (x) { return x*x - 1/8 };
var f3 = function (x) { return -2*x; };
var f4 = function (x) { return 3/2*Math.pow(Math.abs(x), 1/2) - 5/3 - x*x; };
var x = linspace(-1.5, 1.5, 25);
var y1 = x.map(f1);
var y2 = x.map(f2);
var y3 = x.map(f3);
var y4 = x.map(f4);

var plot = new Plot();
plot.setSize(600, 400);

plot.plot(x, y1, 'blue');
plot.plot(x, y2, 'green', 'box');
plot.plot(x, y3, 'orange', 'x', 'noline');
plot.plot(x, y4, 'purple', 'o');

//*/