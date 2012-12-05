
/**
 * Dependencies:
 *     linalg.transpose
 */


// ----- Euler -----

var eulerSystem = function (f, tSpan, y0, h) {
    var y = [y0];
    var t = [tSpan[0]];
    var n = 0;
    var i = 0, size = y0.length;
    var k1;
    
    while (t[n] < tSpan[1]) {
        // Don't go beyond tSpan[1]
        if (t[n] + h > tSpan[1]) h = tSpan[1] - t[n];
        
        k1 = f(t[n], y[n]);
        y[n+1] = [];
        
        for (i = 0; i < size; i++) {
            y[n+1][i] = y[n][i] + h*k1[i];
        }
        t[n+1] = t[n] + h;
        n++;
    }
    
    return {t:t, y:linalg.transpose(y), evals:n};
};

// ----- Runge-Kutta (4th order) ----- 

var rk4System = function (f, tSpan, y0, h) {
    var y = [y0];
    var t = [tSpan[0]];
    var n = 0;
    var k1, k2, k3, k4;
    var i, size = y0.length;
    var yEst = [];
    
    while (t[n] < tSpan[1]) {
        
        // Don't go beyond tSpan[1]
        if (t[n] + h > tSpan[1]) h = tSpan[1] - t[n];
        
        
        k1 = f(t[n], y[n]);
        
        for (i = 0; i < size; i++) {
            yEst[i] = y[n][i] + h/2*k1[i];
        }
        k2 = f(t[n] + h/2, yEst);
        
        for (i = 0; i < size; i++) {
            yEst[i] = y[n][i] + h/2*k2[i];
        }
        k3 = f(t[n] + h/2, yEst);
        
        for (i = 0; i < size; i++) {
            yEst[i] = y[n][i] + h*k3[i];
        }
        k4 = f(t[n] + h, yEst);
        
        
        y[n+1] = [];
        for (i = 0; i < size; i++) {
            y[n+1][i] = y[n][i] + h/6 * (k1[i] + 2*k2[i] + 2*k3[i] + k4[i]);
        }
        
        t[n+1] = t[n] + h;
        n++;
    }
    
    return {t:t, y:linalg.transpose(y), evals:n*4};
};

// ----- Dorman-Prince (adaptive Runge-Kutta) ----- 

var dp54System = function (f, tSpan, y0, tol, h0) {
    var y = [y0];
    var t = [tSpan[0]];
    var n = 0, iterations = 0;
    var k1, k2, k3, k4, k5, k6, k7;
    var h = h0 || (tSpan[1] - tSpan[0]) / 100; // initial guess
    var r, scale, r2, ri;
    var i, yEst = [], size = y0.length;
    
    var a21 = 1/5,
        a31 = 3/40, a32 = 9/40,
        a41 = 44/45, a42 = -56/15, a43 = 32/9,
        a51 = 19372/6561, a52 = -25360/2187, a53 = 64448/6561, a54 = -212/729,
        a61 = 9017/3168, a62 = -355/33, a63 = 46732/5247, a64 = 49/176, a65 = -5103/18656,
        a71 = 35/384, a73 = 500/1113, a74 = 125/192, a75 = -2187/6784, a76 = 11/84;
    
    // 5th order coefficients
    var b1 = 35/384, b3 = 500/1113, b4 = 125/192, b5 = -2187/6784, b6 = 11/84; // b7 = 0;
    
    var c2 = 1/5, c3 = 3/10, c4 = 4/5, c5 = 8/9; // c6 = 1, c7 = 1;
    
    // coefficients for error calculation (e_i = b_i - b^_i)
    var e1 = 71/57600, e3 = -71/16695, e4 = 71/1920,
        e5 = -17253/339200, e6 = 22/525, e7 = -1/40;
    
    tol || (tol = 1e-2);
    
    while (t[n] < tSpan[1]) {
        
        // Don't go beyond tSpan[1]
        if (t[n] + h > tSpan[1]) h = tSpan[1] - t[n];
                
        k1 = f(t[n], y[n]);
        
        for (i = 0; i < size; i++) {
            yEst[i] = y[n][i] + h*(a21*k1[i]);
        }
        k2 = f(t[n] + c2*h, yEst);
        
        for (i = 0; i < size; i++) {
            yEst[i] = y[n][i] + h*(a31*k1[i] + a32*k2[i]);
        }
        k3 = f(t[n] + c3*h, yEst);
        
        for (i = 0; i < size; i++) {
            yEst[i] = y[n][i] + h*(a41*k1[i] + a42*k2[i] + a43*k3[i]);
        }
        k4 = f(t[n] + c4*h, yEst);
        
        for (i = 0; i < size; i++) {
            yEst[i] = y[n][i] + h*(a51*k1[i] + a52*k2[i] + a53*k3[i] + a54*k4[i]);
        }
        k5 = f(t[n] + c5*h, yEst);
        
        for (i = 0; i < size; i++) {
            yEst[i] = y[n][i] + h*(a61*k1[i] + a62*k2[i] + a63*k3[i] + a64*k4[i] + a65*k5[i]);
        }
        k6 = f(t[n] + h, yEst);
        
        for (i = 0; i < size; i++) {
            yEst[i] = y[n][i] + h*(a71*k1[i] + a73*k3[i] + a74*k4[i] + a75*k5[i] + a76*k6[i]);
        }
        k7 = f(t[n] + h, yEst);
        
        // r = estimated error / h
        for (i = 0, r2 = 0; i < size; i++) {
            ri = e1*k1[i] + e3*k3[i] + e4*k4[i] + e5*k5[i] + e6*k6[i] + e7*k7[i];
            r2 += ri*ri;
        }
        r = Math.sqrt(r2);
        
        // Step forward if accurate enough
        if (r < tol) {
            // Use 5th order estimation (local extrapolation)
            y[n+1] = [];
            for (i = 0; i < size; i++) {
                y[n+1][i] = y[n][i] + h*(b1*k1[i] + b3*k3[i] + b4*k4[i] + b5*k5[i] + b6*k6[i]);
            }
            t[n+1] = t[n] + h;
            n++;
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
    
    return {t:t, y:linalg.transpose(y), evals:1 + 6*iterations};
};

// Alternative
// ----- Dorman-Prince (adaptive Runge-Kutta) ----- 

var dp54System2 = function (f, tSpan, y0, tol, h0) {
    var y = [y0];
    var t = [tSpan[0]];
    var n = 0, evals = 0;
    var h = h0 || (tSpan[1] - tSpan[0]) / 100; // initial guess
    var r, scale, r2, ri;
    
    var k = [], j, g;
    var i, yEst = [], yEstSlope, size = y0.length;
    var a = [[1/5],
             [3/40, 9/40],
             [44/45, -56/15, 32/9],
             [19372/6561, -25360/2187, 64448/6561, -212/729],
             [9017/3168, -355/33, 46732/5247, 49/176, -5103/18656],
             [35/384, 0, 500/1113, 125/192, -2187/6784, 11/84]];
    
    var b = [35/384, 0, 500/1113, 125/192, -2187/6784, 11/84];
    
    var c = [1/5, 3/10, 4/5, 8/9, 1, 1];
    
    // coefficients for error calculation (e = b - b*)
    var e = [71/57600, 0, -71/16695, 71/1920, -17253/339200, 22/525, -1/40];
    
    tol || (tol = 1e-2);
    
    while (t[n] < tSpan[1]) {
        
        // Don't go beyond tSpan[1]
        if (t[n] + h > tSpan[1]) h = tSpan[1] - t[n];
        
        k[0] = f(t[n], y[n]);
        
        for (j = 1; j <= 6; j++) {
            for (i = 0; i < size; i++) {
                yEstSlope = 0;
                for (g = 0; g < j; g++) {
                    yEstSlope += a[j-1][g]*k[g][i];    
                }
                yEst[i] = y[n][i] + h*yEstSlope;
            }
            k[j] = f(t[n] + c[j-1]*h, yEst);
        }
        
        // r = estimated error / h
        for (i = 0, r2 = 0; i < size; i++) {
            ri = e[0]*k[0][i] + e[2]*k[2][i] + e[3]*k[3][i] + e[4]*k[4][i] + 
                   e[5]*k[5][i] + e[6]*k[6][i];
            r2 += ri*ri;
        }
        r = Math.sqrt(r2);
        scale = 0.84 * Math.pow(tol / r, 1/4); // (1/2)^(1/4) ≈ 0.84
        
        // Check if step is accurate enough
        if (r < tol) {
            y[n+1] = [];
            for (i = 0; i < size; i++) {
                y[n+1][i] = y[n][i] + h*(b[0]*k[0][i] + b[2]*k[2][i] + 
                            b[3]*k[3][i] + b[4]*k[4][i] + b[5]*k[5][i]);
            }
            t[n+1] = t[n] + h;
            n++;
        }
        
        // Adjust step size
        if (scale < 0.1) h *= 0.1;
        else if (scale > 4) h *= 4;
        else h *= scale;
        
        if (h > 2) h = 2; // too large?
        else if (h < 1e-6) h = 1e-6;
        
        evals += 7;
    }
    
    return {t:t, y:linalg.transpose(y), evals:evals};
};
