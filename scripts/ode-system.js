
var stepSize = 0.04;
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
var plot1 = new Plot().size(500, 300);
var plot2 = new Plot().size(500, 300);
console.log(' ');

var t = linspace(tSpan[0], tSpan[1], 200); 
var exact = linalg.transpose(t.map(y));
plot1.plot(t, exact[0], {color: 'gray'}); // exact
plot2.plot(t, exact[1], {color: 'darkgray'}); // exact

sol = ode.euler(f, tSpan, y0, stepSize);
plot1.plot(sol.t, sol.y[0], {color: 'crimson', marker: 'x'});
plot2.plot(sol.t, sol.y[1], {color: 'blue', marker: 'x'});
logError('euler', sol, y);

sol = ode.rk4(f, tSpan, y0, 4*stepSize);
plot1.plot(sol.t, sol.y[0], {color: 'green', marker: 'o'});
plot2.plot(sol.t, sol.y[1], {color: 'purple', marker: 'o'});
logError('rk4', sol, y);

sol = ode.dp54(f, tSpan, y0, 1e-3, 0.5);
plot1.plot(sol.t, sol.y[0], {color: 'royalblue', marker: 'box'});
plot2.plot(sol.t, sol.y[1], {color: 'orange', marker: 'box'});
logError('dp54', sol, y);
