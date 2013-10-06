/**
 * Solves the non-linear system f(x) = 0 using Newton's method
 * Returns x as a row vector
 * 
 * Dependencies:
 *     linalg.norm
 *     linalg.solve
 */

var fsolve = function (fun, x0) {
    
    var n = x0.length;
    var x = x0;
    var i, j;
    var jacobi = [], f, fh, xh, fMinus, step;
    var h = 1e-8;
    
    if (n > 1e5) { // FIXME: tune limit
        throw 'Sorry, this will take far too long. The system is too large';
    }
    
    var iterations = 0;
    var tolerance = 1e-6;
    
    while (iterations == 0 || linalg.norm(f) > tolerance) {
        
        // Calculate Jacobi matrix
        for (i = 0; i < n; i++) {
            jacobi[i] = [];
        }
        
        f = fun(x);
        
        for (j = 0; j < n; j++) {
            xh = x.slice();
            xh[j] += h;
            fh = fun(xh);
            
            for (i = 0; i < n; i++) {
                jacobi[i][j] = (fh[i] - f[i]) / h;
            }
        }
        
        // Solve linear system and step forward
        fMinus = [];
        for (i = 0; i < n; i++) {
            fMinus[i] = -f[i];
        }
        
        step = linalg.solve(jacobi, fMinus);
        
        for (i = 0; i < n; i++) {
            x[i] += step[i];
        }
        
        iterations++;
    }
    
    return x;
};