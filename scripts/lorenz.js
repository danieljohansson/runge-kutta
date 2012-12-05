/**
 * Lorenz attractor
 */
 
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

var sol = ode.rk4(f, tSpan, y0, stepSize);
plot3.plot(sol.y[0], sol.y[1], 'crimson');
