
// u = [h, v, m]

console.log(' ');

var mu = function (x, t) {
    var i = Math.floor(t / (tn / x.length));
    return x[i];
};
var f = function (mu, t, u) {
    var c1 = 1250;
    var c2 = 1/3;
    var g = 9.82;
    return [
        u[1],
        (c1*mu(t) - c2*u[1]*Math.abs(u[1]) - u[2]*g + mu(t)*u[1]) / u[2],
        -mu(t)
    ];
};

var perturb = function (x, i, magnitude) {
    var y = x.slice();
    var lim = 15;
    var len = y.length, j;
    var nonZero = 0;
    var epsilon;
    var sum = 0;
    for (j = 0; j < len; j++) {
        if (j !== i && y[j] !== 0) {
            nonZero++;
        }
    }
    epsilon = (lim - y[i] < magnitude ? lim - y[i] : magnitude) / nonZero;
    for (j = 0; j < len; j++) {
        if (j !== i) {
            y[j] -= epsilon;
            if (y[j] < 0) {
                y[j] = 0;
            }
            sum += y[j];
        }
    }
    y[i] = fuel / tn * len - sum - 1e-9;
    if (y[i] > lim) {
        y[i] = lim;
    }

    for (var j = 0, sum = 0; j < len; j++) sum += y[j];
    if (sum*tn/y.length > 900 || sum*tn/y.length < 899) 
        console.warn('fuel = ', sum*tn/y.length, 'kg', y);
    
    return y;
};

var calcHeight = function (x) {
    var sol = ode.rk4(f.bind(this, mu.bind(this, x)), [0, tn], u0, 1/8);
    return Math.max.apply(this, sol.y[0]);
};

var u0 = [14, 0, 1000];
var tn = 180;
var n = 20;
var fuel = 900;
var sol;

var x = [], y;
var maxHeight = 0;
var improved = true;
var height = 0;
var k = 0;

for (var i = 0; i < n; i++) {
    x[i] = (i < n/2) ? 2 * fuel / tn : 0;
}

tic()
for (var p = 1; p < 8; p++) {
    
    k = 0;
    improved = true;
    
    while (improved) {
        
        if (k >= 500) {
            console.warn('Max iterations reached.');
            break;
        }
        
        improved = false;
        
        for (var i = 0; i < x.length; i++) {
            
            y = perturb(x, i, 4/p);
            height = calcHeight(y);
            
            if (height > maxHeight) {
                maxHeight = height;
                x = y;
                improved = true;
                break;
            }
        }
        
        k++;
    }
    console.log('Iterations    :', k, '(' + 4/p + ')');
}
toc();

console.log('Height        :', maxHeight);


sol = ode.rk4(f.bind(this, mu.bind(this, x)), [0, tn], u0, 1/8);
new Plot().options({crosshair: true, axes: true}).plot(sol.t, sol.y[0], {color: 'blue'}) // height
new Plot().options({crosshair: true, axes: true}).plot(sol.t, sol.y[1], {color: 'red'}) // speed
new Plot().options({crosshair: true, axes: true}).plot(sol.t, sol.y[2], {color: 'green'}) // mass
new Plot().options({axes: true}).plot(linspace(0, tn, 300), linspace(0, tn, 300).map(mu.bind(this, x))); // fuel injection [kg/s]

