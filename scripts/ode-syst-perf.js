
//*/ ----- preformance test
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