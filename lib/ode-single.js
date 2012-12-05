/*
http://reference.wolfram.com/mathematica/tutorial/NDSolveExplicitRungeKutta.html
http://users.powernet.co.uk/kienzle/octave/matcompat/scripts/ode_v1.11/ode45.m
*/

// ----- Euler -----

var euler = function (f, tSpan, y0, h) {
    var y = [y0];
    var t = [tSpan[0]];
    var n = 0;
    
    while (t[n] < tSpan[1]) {
        // Don't go beyond tSpan[1]
        if (t[n] + h > tSpan[1]) h = tSpan[1] - t[n];
        
        y[n+1] = y[n] + h * f(t[n], y[n]);
        t[n+1] = t[n] + h;
        n++;
    }
    
    return {t:t, y:y, evals:n};
};

// ----- Heun (2nd order Runge-Kutta) -----

var heun = function (f, tSpan, y0, h) {
    var y = [y0];
    var t = [tSpan[0]];
    var n = 0;
    var k1, k2;
    
    while (t[n] < tSpan[1]) {
        // Don't go beyond tSpan[1]
        if (t[n] + h > tSpan[1]) h = tSpan[1] - t[n];
        
        k1 = f(t[n], y[n]);
        k2 = f(t[n] + h, y[n] + h*k1);
        y[n+1] = y[n] + h/2 * (k1 + k2);
        t[n+1] = t[n] + h;
        n++;
    }
    
    return {t:t, y:y, evals:n*2};
};

// ----- Midpoint (2nd order Runge-Kutta) -----

var midpoint = function (f, tSpan, y0, h) {
    var y = [y0];
    var t = [tSpan[0]];
    var n = 0;
    
    while (t[n] < tSpan[1]) {
        // Don't go beyond tSpan[1]
        if (t[n] + h > tSpan[1]) h = tSpan[1] - t[n];
        
        y[n+1] = y[n] + h * f(t[n] + h/2, y[n] + h/2*f(t[n], y[n]));
        t[n+1] = t[n] + h;
        n++;
    }
    
    return {t:t, y:y, evals:n*2};
};

// ----- Runge-Kutta (4th order) ----- 

var rk4 = function (f, tSpan, y0, h) {
    var y = [y0];
    var t = [tSpan[0]];
    var n = 0;
    var k1, k2, k3, k4;
    
    while (t[n] < tSpan[1]) {
        
        // Don't go beyond tSpan[1]
        if (t[n] + h > tSpan[1]) h = tSpan[1] - t[n];
        
        k1 = f(t[n], y[n]);
        k2 = f(t[n] + h/2, y[n] + h/2*k1);
        k3 = f(t[n] + h/2, y[n] + h/2*k2);
        k4 = f(t[n] + h, y[n] + h*k3);
        
        y[n+1] = y[n] + h/6 * (k1 + 2*k2 + 2*k3 + k4);
        
        t[n+1] = t[n] + h;
        n++;
    }
    
    return {t:t, y:y, evals:n*4};
};

// ----- Dorman-prince 5 (fixed step size) -----

var dp5 = function (f, tSpan, y0, h) {
    var y = [y0];
    var t = [tSpan[0]];
    var n = 0;
    var k1, k2, k3, k4, k5, k6;
    
    var a21 = 1/5,
        a31 = 3/40, a32 = 9/40,
        a41 = 44/45, a42 = -56/15, a43 = 32/9,
        a51 = 19372/6561, a52 = -25360/2187, a53 = 64448/6561, a54 = -212/729,
        a61 = 9017/3168, a62 = -355/33, a63 = 46732/5247, a64 = 49/176, a65 = -5103/18656;
        
    var b1 = 35/384, b3 = 500/1113, b4 = 125/192, b5 = -2187/6784, b6 = 11/84; // b7 = 0;
    
    var c2 = 1/5, c3 = 3/10, c4 = 4/5, c5 = 8/9; // c6 = 1, c7 = 1;
    
    while (t[n] < tSpan[1]) {
        
        // Don't go beyond tSpan[1]
        if (t[n] + h > tSpan[1]) h = tSpan[1] - t[n];
        
        k1 = f(t[n], y[n]);
        k2 = f(t[n] + c2*h, y[n] + h*(a21*k1));
        k3 = f(t[n] + c3*h, y[n] + h*(a31*k1 + a32*k2));
        k4 = f(t[n] + c4*h, y[n] + h*(a41*k1 + a42*k2 + a43*k3));
        k5 = f(t[n] + c5*h, y[n] + h*(a51*k1 + a52*k2 + a53*k3 + a54*k4));
        k6 = f(t[n] + h, y[n] + h*(a61*k1 + a62*k2 + a63*k3 + a64*k4 + a65*k5));
        
        y[n+1] = y[n] + h * (b1*k1 + b3*k3 + b4*k4 + b5*k5 + b6*k6);
        t[n+1] = t[n] + h;
        n++;
    }
    
    return {t:t, y:y, evals:6*n};
};

// ----- Dorman-Prince 5(4) (adaptive Runge-Kutta)

var dp54 = function (f, tSpan, y0, tol, h0) {
    
    var y = [y0];
    var t = [tSpan[0]];
    var n = 0, iterations = 0;
    var k1, k2, k3, k4, k5, k6, k7;
    var h = h0 || (tSpan[1] - tSpan[0]) / 100; // initial guess
    var r, scale;
    
    var a21 = 1/5,
        a31 = 3/40, a32 = 9/40,
        a41 = 44/45, a42 = -56/15, a43 = 32/9,
        a51 = 19372/6561, a52 = -25360/2187, a53 = 64448/6561, a54 = -212/729,
        a61 = 9017/3168, a62 = -355/33, a63 = 46732/5247, a64 = 49/176, a65 = -5103/18656,
        a71 = 35/384, a73 = 500/1113, a74 = 125/192, a75 = -2187/6784, a76 = 11/84;
    
    // 5th order coefficients
    var b1 = 35/384, b3 = 500/1113, b4 = 125/192, b5 = -2187/6784, b6 = 11/84; // b7 = 0;
    
    // 4th order coefficients (no FSAL)
    // var b1 = 5179/57600, b3 = 7571/16695, b4 = 393/640, b5 = -92097/339200, b6 = 187/2100, b7 = 1/40;
    
    var c2 = 1/5, c3 = 3/10, c4 = 4/5, c5 = 8/9; // c6 = 1, c7 = 1;
    
    // coefficients for error calculation (e_i = b_i - b^_i)
    var e1 = 71/57600, e3 = -71/16695, e4 = 71/1920,
        e5 = -17253/339200, e6 = 22/525, e7 = -1/40;
    
    tol || (tol = 1e-3);
    
    // Initial calculation of slope in start point
    // Utilize FSAL (first same as last) property of Dormand-Prince 
    k7 = f(t[0], y[0]);
    
    while (t[n] < tSpan[1]) {
        
        // Don't go beyond tSpan[1]
        if (t[n] + h > tSpan[1]) h = tSpan[1] - t[n];
        
        k1 = k7;
        k2 = f(t[n] + c2*h, y[n] + h*(a21*k1));
        k3 = f(t[n] + c3*h, y[n] + h*(a31*k1 + a32*k2));
        k4 = f(t[n] + c4*h, y[n] + h*(a41*k1 + a42*k2 + a43*k3));
        k5 = f(t[n] + c5*h, y[n] + h*(a51*k1 + a52*k2 + a53*k3 + a54*k4));
        k6 = f(t[n] + h, y[n] + h*(a61*k1 + a62*k2 + a63*k3 + a64*k4 + a65*k5));
        k7 = f(t[n] + h, y[n] + h*(a71*k1 + a73*k3 + a74*k4 + a75*k5 + a76*k6));
        
        // r = estimated error / h
        r = Math.abs(e1*k1 + e3*k3 + e4*k4 + e5*k5 + e6*k6 + e7*k7);
        
        // Step forward if accurate enough
        if (r < tol) {
            // Use the 5th order estimation (local extrapolation)
            y[n+1] = y[n] + h * (b1*k1 + b3*k3 + b4*k4 + b5*k5 + b6*k6);
            t[n+1] = t[n] + h;
            n++;
        }
        else {
            // reset k7 if step is discarded (FSAL)
            k7 = k1;
        }
        
        // Calculate scaling of next step size
        scale = 0.84 * Math.pow(tol / r, 1/4); // (1/2)^(1/4) ≈ 0.84
        
        // Adjust step size
        if (scale < 0.1) h *= 0.1;
        else if (scale > 4) h *= 4;
        else h *= scale;
        
        if (h > 2) h = 2; // too large?
        else if (h < 1e-9) h = 1e-9;
        
        iterations++;
        
        if (iterations > 1e6) {
            throw 'Maximum numer of iterations (1 000 000) reached.';
        }
    }
    
    return {t:t, y:y, evals:1 + 6*iterations};
};
