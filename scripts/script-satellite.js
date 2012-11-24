var GM = 19.93;
var dt = 0.01;
var n, t, r, x, y, vx, vy, ax, ay;
var j;

// ===== leapfrog =====
n = 0;
t = 0;
r = 100;
x = [2];
y = [0];
vx = [0];
vy = [4.038]; // jr/h
ax = [0];
ay = [0];

while (t < 3*24 && r > 1) {
    
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
console.log('Leapfrog:', n);

var plot1 = new Plot();
plot1.setSize(800, 600);
plot1.plot(x, y, 'orange');

// Jorden!!
j = linspace(0, 2*Math.PI, 40);
plot1.plot(j.map(Math.cos), j.map(Math.sin), '#5e5');


// ===== Solver =====
var sol, y0 = [2, 0, 0, 4.038];
var f = function (t, x) {
    return [
        x[2],
        x[3],
        -GM * x[0] / Math.pow(x[0]*x[0] + x[1]*x[1], 3/2),
        -GM * x[1] / Math.pow(x[0]*x[0] + x[1]*x[1], 3/2)
    ];
};

// euler
sol = eulerSystem(f, [0, 2*24], y0, 0.5*dt);
plot1.plot(sol.y[0], sol.y[1], 'lightblue');
console.log('Euler:   ', sol.t.length);

// runge-kutta 4
tic('rk4')
sol = rk4System(f, [0, 30*24], y0, 2*dt);
toc('rk4')
plot1.plot(sol.y[0], sol.y[1], 'purple');
console.log('RK4:     ', sol.t.length);

// dp54
tic('dp54')
sol = dp54System(f, [0, 30*24], y0, 1e-9, 1e-9);
toc('dp54')
plot1.plot(sol.y[0], sol.y[1], 'red');
console.log('DP54:    ', sol.t.length);

plot1.axisEqual();
