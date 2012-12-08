
// u = [h, v, m]

var f = function (t, u) {
    var c1 = 1250;
    var c2 = 1/3;
    var g = 9.82;
    var mu = function (t) { 
        return t < 50 ? 10 :
            t < 100 ? 6 : 
            t < 150 ? 2 : 0;
    };
    return [
        u[1],
        (c1*mu(t) - c2*u[1]*Math.abs(u[1]) - u[2]*g + mu(t)*u[1]) / u[2],
        -mu(t)
    ];
};

var u0 = [14, 0, 1000];

tic();
sol = ode.rk4(f, [0, 200], u0, 1/16);
toc();

new Plot().plot(sol.t, sol.y[0], 'blue').crosshairOn().axisOn();
new Plot().plot(sol.t, sol.y[1], 'green').crosshairOn().axisOn();
new Plot().plot(sol.t, sol.y[2], 'red').crosshairOn().axisOn();

console.log('Maximum height:', Math.max.apply(this, sol.y[0]));
