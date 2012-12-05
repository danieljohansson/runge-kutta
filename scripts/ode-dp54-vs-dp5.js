// dp5 vs. dp54 ?

var t, sol, p = [];
var tSpan = [], f = [], y = [], y0 = [];

tSpan[0] = [0, 10];
f[0] = function (t, y) { return y - t*t + 1; };
y[0] = function (t) { return t*t + 2*t + 1 - 0.5*Math.pow(Math.E, t); };
y0[0] = 0.5;

tSpan[1] = [0, 40];
f[1] = function (t, y) { return Math.sin(5*t); };
y[1] = function (t) { return -1/5*Math.cos(5*t); };
y0[1] = -1/5;

tSpan[2] = [1, 25];
f[2] = function (t, y) { return 2/t*y + t*t*Math.cos(t); };
y[2] = function (t) { return t*t*(Math.sin(t) + 1 - Math.sin(1)); };
y0[2] = 1;

tSpan[3] = [0, 2.75];
f[3] = function (t, y) { return 3*t*y; };
y[3] = function (t) { return Math.exp(3*t*t/2); };
y0[3] = 1;

tSpan[4] = [0, 1.57];
f[4] = function (t, y) { return y*y + 1; };
y[4] = function (t) { return Math.tan(t); };
y0[4] = 0;

for (var i = 0; i <= 4; i++) {
    
    console.log(' ');
    p[i] = new Plot();
    p[i].setSize(350, 250);
    
    p[i].axisOn();
    
    t = linspace(tSpan[i][0], tSpan[i][1], 300); 
    p[i].plot(t, t.map(y[i]), 'gray'); // exact
    
    sol = ode.dp54(f[i], tSpan[i], y0[i], 1e-2, 0.1);
    p[i].plot(sol.t, sol.y, 'royalblue', 'o');
    logError(i + ' dp54', sol, y[i]);
    
    sol = ode.dp5(f[i], tSpan[i], y0[i], (tSpan[i][1] - tSpan[i][0]) / sol.t.length);
    p[i].plot(sol.t, sol.y, 'red', '+');
    logError(i + ' dp5', sol, y[i]);
}


