/*/ 
var stepSize = 0.05;
var tSpan = [0, 1];
var f = function (t, y) {
    return [
        y[1],
        Math.exp(2*t) * Math.sin(t) - 2*y[0] + 2*y[1]
    ];
};
var y = function (t) { 
    return [
        0.2 * Math.exp(2*t) * (Math.sin(t) - 2*Math.cos(t)),
        0.2 * Math.exp(2*t) * (4*Math.sin(t) - 3*Math.cos(t))
    ];
};
var y0 = [-0.4, -0.6];

var sol;
var plot1 = new Plot(); plot1.setSize(500, 300);
var plot2 = new Plot(); plot2.setSize(500, 300);
console.log(' ');

var t = linspace(tSpan[0], tSpan[1], 200); 
var exact = transpose(t.map(y));
plot1.plot(t, exact[0], 'gray'); // exact
plot2.plot(t, exact[1], 'darkgray'); // exact

sol = eulerSystem(f, tSpan, y0, stepSize);
plot1.plot(sol.t, sol.y[0], 'crimson', 'x');
plot2.plot(sol.t, sol.y[1], 'blue', 'x');
logError('euler', sol, y);

sol = rk4System(f, tSpan, y0, 4*stepSize);
plot1.plot(sol.t, sol.y[0], 'green', 'o');
plot2.plot(sol.t, sol.y[1], 'purple', 'o');
logError('rk4', sol, y);

sol = dp54System(f, tSpan, y0, 1e-3, 0.5);
plot1.plot(sol.t, sol.y[0], 'royalblue', 'box');
plot2.plot(sol.t, sol.y[1], 'orange', 'box');
logError('dp54', sol, y);

//*/


/*/ ----- preformance test
var plot3 = new Plot(); plot3.setSize(500, 300);
tSpan = [1, 20];

f = function (t, y) { return 2/t*y + t*t*Math.cos(t); };
y = function (t) { return t*t*(Math.sin(t) + 1 - Math.sin(1)); };
y0 = 1;
var i = 1e4;
tic('single');
while (i--) {
    sol = dp54(f, tSpan, y0, 1e-3, 0.5);
}
toc('single');

plot3.plot(linspace(tSpan[0], tSpan[1], 200), linspace(tSpan[0], tSpan[1], 200).map(y), 'rgba(0,0,0,.3)');

plot3.plot(sol.t, sol.y, 'royalblue');
logError('dp54', sol, y);

f = function (t, y) { return [2/t*y[0] + t*t*Math.cos(t)]; };
y = function (t) { return [t*t*(Math.sin(t) + 1 - Math.sin(1))]; };
y0 = [1];
i = 1e4;
tic('system');
while (i--) {
    sol = dp54System2(f, tSpan, y0, 1e-3, 0.5);
}
toc('system');

plot3.plot(sol.t, sol.y[0], 'red');
logError('dp54', sol, y);

//*/

//*/ ----- Lorenz attractor
// http://numericjs.com/workshop.php?link=fdd38094da018f6071cb2d51d47c7fb3de869cb5dd0b4f3b677b480ce7ffbd31

var stepSize = 0.01;
var tSpan = [0, 30];
var f = function (t, y) {
    return [
        10 * (y[1] - y[0]),
        y[0] * (28 - y[2]) - y[1],
        y[0] * y[1] - (8/3) * y[2]
    ];
};
var y0 = [-1, 3, 4];

var plot3 = new Plot().setSize(800, 600).crosshairOn().axisOn().axisEqual();

var sol = rk4System(f, tSpan, y0, stepSize);
plot3.plot(sol.y[0], sol.y[1], 'crimson');

//*/

