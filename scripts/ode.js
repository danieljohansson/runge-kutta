
/*/
var stepSize = 0.075;
var tSpan = [1, 30];
var f = function (t, y) { return 2/t*y + t*t*Math.cos(t); };
var y = function (x) { return x*x*(Math.sin(x) + 1 - Math.sin(1)); };
var y0 = 1;
//*/

//*/
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

console.log(' ');
var sol;
var p = new Plot().size(800, 600);

var t = linspace(tSpan[0], tSpan[1], 200); 
p.plot(t, t.map(y), {color: 'gray'}); // exact

sol = ode.euler(f, tSpan, y0, stepSize);
p.plot(sol.t, sol.y, {color: 'red', marker: 'x'});
logError('euler', sol, y);

sol = ode.heun(f, tSpan, y0, 2*stepSize);
p.plot(sol.t, sol.y, {color: 'orange', marker: 'o'});
logError('heun', sol, y);

sol = ode.midpoint(f, tSpan, y0, 2*stepSize);
p.plot(sol.t, sol.y, {color: 'lightblue'});
logError('midpoint', sol, y);

sol = ode.rk4(f, tSpan, y0, 4*stepSize);
p.plot(sol.t, sol.y, {color: 'green', marker: 'box'});
logError('rk4', sol, y);

sol = ode.dp5(f, tSpan, y0, 6*stepSize);
p.plot(sol.t, sol.y, {color: 'darkcyan', marker: '+'});
logError('dp5', sol, y);

sol = ode.dp54(f, tSpan, y0);
p.plot(sol.t, sol.y, {color: 'purple', marker: 'o'});
logError('dp54', sol, y);


