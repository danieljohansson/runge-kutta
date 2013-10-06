var x, y, xx, yy, s;

/*/
x = linspace(0, 10, 10);
y = x.map(Math.sin);
s = spline.linear(x, y);
xx = linspace(0, 10, 100);
yy = xx.map(s.at);

var p1 = new Plot().setSize(800, 600);
p1.plot(linspace(0, 10, 200), linspace(0, 10, 200).map(Math.sin), 'gray');
p1.plot(x, y, 'red', 'box', 'noline');
p1.plot(xx, yy, 'blue');

x = [1, 2, 3, 4, 5, 6];
y = [3, 5, 6, 2, 4, 5];
p1.plot(x, y, 'red', 'box', 'noline');


s = spline.cubic1(x, y);
xx = linspace(x[0], x[5], 100);
yy = xx.map(s.at);
p1.plot(xx, yy);

s = spline.cubic(x, y);
xx = linspace(x[0], x[5], 100);
yy = xx.map(s.at);
p1.plot(xx, yy, 'green');
//*/

/*/
x = linspace(0, 80, 80);
xx = linspace(0, 80, 800);
var f = function (x) { return Math.exp(x/30)*Math.sin(x); };
y = x.map(f);
yy = xx.map(f);

var p2 = new Plot().setSize(1300, 600);
p2.plot(x, y, 'gray', 'box', 'noline');
p2.plot(xx, yy, 'gray');

tic('reloaded');
s = spline.cubic(x, y);
toc('reloaded');
yy = xx.map(s.at);
p2.plot(xx, yy, 'green');

tic('naive');
s = spline.cubic1(x, y);
toc('naive');
yy = xx.map(s.at);
p2.plot(xx, yy, 'blue');
//*/

//*/
var p1 = new Plot().size(255, 255);

x = [0, 26, 78, 106, 136, 154, 223, 255];
y = [0, 62, 52, 99, 28, 153, 174, 255];
p1.plot(x, y, {color: 'red', marker: 'box', line: false});

s = spline.cubic(x, y);
xx = linspace(x[0], x[7], 255);
yy = xx.map(s.at);
p1.plot(xx, yy, {color: 'orange'});
//*