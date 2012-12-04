var uPlot = new Plot();
var kPlot = new Plot();
var ePlot = new Plot();
var plotEnergy = function (sol, color) {
    var i, U = [], K = [], E = [];
    for (i = 0; i < sol.t.length; i++) {
        // E = potential energy + kinetic energy
        // m = 1
        U.push(GM - GM / Math.sqrt(sol.y[0][i]*sol.y[0][i] + sol.y[1][i]*sol.y[1][i]));
        K.push(7.7*Math.sqrt(sol.y[2][i]*sol.y[2][i] + sol.y[3][i]*sol.y[3][i]) / 2);
        E.push(U[i] + K[i]);
    }
    uPlot.plot(sol.t, U, color).axisOn().setSize(400, 300);
    kPlot.plot(sol.t, K, color).axisOn().setSize(400, 300);
    ePlot.plot(sol.t, E, color).axisOn().setSize(400, 300);
};


// http://www.wolframalpha.com/input/?i=geopotential+of+earth+in+cubic+mean+radii+of+earth+per+hour+squared
var GM = 19.97644; // jr^3 / h^2
var dt = 0.1;
var n, t, r, x, y, vx, vy, ax, ay;
var j;
var r0 = 2;
var v0 = Math.sqrt(GM / r0);
//var v0 = 4;
var tFin = 2*31*24;
var tFin = 14*24;

console.log('- - - - - - - - - - - -');

tic('leapfrog');
// ===== leapfrog =====
n = 0;
t = 0;
r = 100; // arbitr. r > 1
x = [r0];
y = [0];
vx = [0];
vy = [v0]; // jr/h
ax = [0];
ay = [0];

while (t < tFin && r > 1) {
    
    x[n+1] = x[n] + vx[n]*dt + 0.5*ax[n]*dt*dt;
    y[n+1] = y[n] + vy[n]*dt + 0.5*ay[n]*dt*dt;
    
    r = Math.sqrt(x[n+1]*x[n+1] + y[n+1]*y[n+1]);
    
    ax[n+1] = -GM*x[n+1]/(r*r*r);
    ay[n+1] = -GM*y[n+1]/(r*r*r);

    vx[n+1] = vx[n] + 0.5*(ax[n] + ax[n+1])*dt;
    vy[n+1] = vy[n] + 0.5*(ay[n] + ay[n+1])*dt;
    
    t = t + dt;
    
    n++;
}
toc('leapfrog');
console.log('Leapfrog :', n);

var plot1 = new Plot();
var elems = 300;
plot1.axisEqual();

//plot1.plot(x, y, 'orange');
plot1.plot(x.slice(0,elems), y.slice(0,elems), 'orange');
plot1.plot(x.slice(-elems), y.slice(-elems), 'gold');
plotEnergy({t:linspace(0,tFin,n), y:[x, y, vx, vy]}, 'orange');

// Jorden!!
j = linspace(0, 2*Math.PI, 40);
plot1.plot(j.map(Math.cos), j.map(Math.sin), '#5e5');

// exact circle
plot1.plot(
    linspace(0, 2*Math.PI, 60).map(function (x) { return 2*Math.cos(x); }), 
    linspace(0, 2*Math.PI, 60).map(function (x) { return 2*Math.sin(x); }), 
    '#bbb'
);


// ===== Solver =====
var sol, y0 = [r0, 0, 0, v0];
var f = function (t, x) {
    return [
        x[2],
        x[3],
        -GM * x[0] / Math.pow(x[0]*x[0] + x[1]*x[1], 3/2),
        -GM * x[1] / Math.pow(x[0]*x[0] + x[1]*x[1], 3/2)
    ];
};

/*
// euler
sol = eulerSystem(f, [0, tFin], y0, 0.5*dt);
plot1.plot(sol.y[0].slice(0,elems), sol.y[1].slice(0,elems), 'lightblue');
plot1.plot(sol.y[0].slice(-elems), sol.y[1].slice(-elems), 'lightblue');
console.log('Euler   : ', sol.t.length);
plotEnergy(sol, 'lightblue');
*/

// runge-kutta 4
tic('rk4')
sol = rk4System(f, [0, tFin], y0, 2*dt);
toc('rk4')
//plot1.plot(sol.y[0], sol.y[1], 'purple');
plot1.plot(sol.y[0].slice(0,elems), sol.y[1].slice(0,elems), 'purple');
plot1.plot(sol.y[0].slice(-elems), sol.y[1].slice(-elems), 'magenta');
console.log('RK4     : ', sol.t.length);
plotEnergy(sol, 'purple');


