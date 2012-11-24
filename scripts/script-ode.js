
// ============================================ //
// Single
// ============================================ //

/*/
var stepSize = 0.075;
var tSpan = [1, 30];
var f = function (t, y) { return 2/t*y + t*t*Math.cos(t); };
var y = function (x) { return x*x*(Math.sin(x) + 1 - Math.sin(1)); };
var y0 = 1;
//*/

/*/
var stepSize = 1/6;
var tSpan = [0, 4.3];
var f = function (t, y) { return -2*t*t*t + 12*t*t - 20*t + 17/2; };
var y = function (t) { return -1/2*t*t*t*t + 4*t*t*t - 10*t*t + 17/2*t; };
var y0 = 0;
//*/

/*/
var stepSize = 1/12;
var tSpan = [0, 1];
var f = function (t, y) { return y; };
var y = function (t) { return Math.pow(Math.E, t); };
var y0 = 1;
//*/

/*/
var stepSize = 1/60;
var tSpan = [0, 0.3];
var f = function (t, y) { return -15*y; };
var y = function (x) { return Math.pow(Math.E, -15*x); };
var y0 = 1;
//*/

/*/
var stepSize = 0.025;
var tSpan = [0, 0.5];
var f = function (t, y) { return y - t*t + 1; };
var y = function (t) { return t*t + 2*t + 1 - 0.5*Math.pow(Math.E, t); };
var y0 = 0.5;
//*/

/*/
console.log(' ');
var sol;
var p = new Plot();
p.setSize(800, 600);

var t = linspace(tSpan[0], tSpan[1], 200); 
p.plot(t, t.map(y), 'gray'); // exact

sol = euler(f, tSpan, y0, stepSize);
p.plot(sol.t, sol.y, 'red', 'x');
logError('euler', sol, y);

sol = heun(f, tSpan, y0, 2*stepSize);
p.plot(sol.t, sol.y, 'orange', 'o');
logError('heun', sol, y);

sol = midpoint(f, tSpan, y0, 2*stepSize);
p.plot(sol.t, sol.y, 'lightblue');
logError('midpoint', sol, y);

sol = rk4(f, tSpan, y0, 4*stepSize);
p.plot(sol.t, sol.y, 'green', 'box');
logError('rk4', sol, y);

sol = dp45(f, tSpan, y0);
p.plot(sol.t, sol.y, 'darkcyan');
logError('dp45', sol, y);

sol = dp54(f, tSpan, y0);
p.plot(sol.t, sol.y, 'purple', 'o');
logError('dp54', sol, y);
//*/


//*/ =========
// dp45 vs. dp54 ? 
// dp54 is awesomest

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
    
    sol = dp45(f[i], tSpan[i], y0[i], 1e-2, 0.1);
    p[i].plot(sol.t, sol.y, 'red', '+');
    logError(i + ' dp45', sol, y[i]);
    
    sol = dp54(f[i], tSpan[i], y0[i], 1e-2, 0.1);
    p[i].plot(sol.t, sol.y, 'royalblue', 'o');
    logError(i + ' dp54', sol, y[i]);
}

//*/











