// Solves the linear system
// Ax = b
// returns x as a row vector

// FIXME: investigate stability
var linsolve = function (A, b) {
    
    var n = A.length;
    var x = [];
    
    if (n > 0 && A[0].length !== n) {
        throw '"A" must a n-by-n matrix.';
    }
    if (b.length !== n) {
        throw '"b" must be of length ' + n + ' for this system.';
    }
    if (n > 1e5) { // FIXME: tune limit
        throw 'Sorry, this will take far too long. The system is too large';
    }
    
    var p = linspace(0, n-1, n); // row permutation vector
    var maxIndex, temp;
    var i, j, k, factor;
    
    // === Gaussian elimination
    for (k = 0; k <= n-2; k++) {
        
        // Pivoting (for stability),
        // Find row with largest value and move it up 
        for (i = k, maxIndex = k; i <= n-1; i++) {
            if (Math.abs(A[p[i]][k]) > Math.abs(A[p[maxIndex]][k])) {
                maxIndex = i;
            }
        }
        if (A[p[maxIndex]][k] === 0) {
            throw 'Matrix is singular';
        }
        else if (Math.abs(A[p[maxIndex]][k]) < 1e-14) {
            console.warn('Matrix is close to singular.');
        }
        
        // Do permutation
        temp = p[maxIndex];
        p[maxIndex] = p[k];
        p[k] = temp;
        
        // Zero out rest of column
        for (i = k+1; i <= n-1; i++) {
            factor = A[p[i]][k] / A[p[k]][k];
            for (j = k; j <= n-1; j++) {
                A[p[i]][j] = A[p[i]][j] - factor * A[p[k]][j];
            }
            b[p[i]] = b[p[i]] - factor * b[p[k]];
        }
    }
    
    // === Back substitution
    for (i = n-1; i >= 0; i--) {
        x[i] = b[p[i]];
        for (j = i+1; j <= n-1; j++) {
            x[i] -= A[p[i]][j] * x[j];
        }
        x[i] /= A[p[i]][i];
    }
    
    /* // explicit back substitution for 4-by-4 matrix
    x[3] = ( b[p[3]]                                                             ) / A[p[3]][3];
    x[2] = ( b[p[2]] - A[p[2]][3] * x[3]                                         ) / A[p[2]][2];
    x[1] = ( b[p[1]] - A[p[1]][3] * x[3] - A[p[1]][2] * x[2]                     ) / A[p[1]][1];
    x[0] = ( b[p[0]] - A[p[0]][3] * x[3] - A[p[0]][2] * x[2] - A[p[0]][1] * x[1] ) / A[p[0]][0];
    */
    
    return x;
};