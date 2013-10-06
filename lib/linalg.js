var linalg = {};


/** 
 * Euclidian vector norm 
 */
linalg.norm = function (x) {
    var sqSum = 0;
    for (var i = 0, len = x.length; i < len; i++) {
        sqSum += x[i] * x[i];
    }
    return Math.sqrt(sqSum);
};

/**
 * Matrix transpose of A
 */
linalg.transpose = function (A) {
    var m = A.length;
    var n = A[0].length;
    var T = [];
    
    for (var j = 0; j < n; j++) {
        T[j] = [];
        for (var i = 0; i < m; i++) {
            T[j][i] = A[i][j];
        }
    }
    return T;
};

/**
 * Random vector
 */
linalg.randVector = function (n) {
    var i, b = new Float64Array(n);
    
    for (i = 0; i < n; i++) {
        b[i] = Math.random();
    }
    return b;
};

/**
 * Random matrix
 */
linalg.randMatrix = function (m, n) {
    var buf, A = [];
    n || (n = m);
    
    buf = new ArrayBuffer(m*n*8); // Array buffer
    
    for (var i = 0; i < m; i++) {
        A[i] = new Float64Array(buf, i*n*8, n);
        for (var j = 0; j < n; j++) {
            A[i][j] = Math.random();
        }
    }
    return A;
};

/**
 * Matrix vector multiplication A*b
 */
linalg.mvMult = function (A, b) {
    
	var m = A.length; // rows
	var n = A[0].length; // cols
    var ans = [];
    
	if (b.length !== n) {
		throw new Error('Matrix dimensions must agree.');
	}
    
	for (var i = 0; i < m; i++) {
        ans[i] = 0;
		for (var j = 0; j < n; j++) {
			ans[i] += A[i][j] * b[j];
		}
	}
    return ans;
};

/**
 * Matrix matrix multiplication A*B
 */
linalg.mmMult = function (A, B) {
    
    var rowsA = A.length;
	var colsA = A[0].length;
    var rowsB = B.length;
	var colsB = B[0].length;
    var ans = [];
    
	if (colsA !== rowsB) {
		throw new Error('Matrix dimensions must agree.');
	}
    
	for (var i = 0; i < rowsA; i++) {
        ans[i] = [];
        for (var j = 0; j < colsB; j++) {
            ans[i][j] = 0;
            for (var k = 0; k < colsA; k++) {
                ans[i][j] += A[i][k] * B[k][j];
            }
        }
	}
    return ans;
};

/**
 * Matrix matrix multiplication A*B (typed array)
 */
linalg.mmMultTyped = function (A, B) {
    
    var rowsA = A.length;
	var colsA = A[0].length;
    var rowsB = B.length;
	var colsB = B[0].length;
    var buf = new ArrayBuffer(rowsA*colsB*8); // Array buffer
    var ans = []; // to store views into the array buffer
    
	if (colsA !== rowsB) {
		throw new Error('Matrix dimensions must agree.');
	}
    
	for (var i = 0; i < rowsA; i++) {
        ans[i] = new Float64Array(buf, i*colsB*8, colsB);
        for (var j = 0; j < colsB; j++) {
            ans[i][j] = 0;
            for (var k = 0; k < colsA; k++) {
                ans[i][j] += A[i][k] * B[k][j];
            }
        }
	}
    return ans;
};

/**
 * Solves the linear system Ax = b using Gaussian
 * elimination with row pivoting, and back substitution
 * Returns x as a row vector
 * (A and b are modified)
 */
// FIXME: investigate stability
linalg.solve = function (A, b) {
    var n = A.length;
    var x = [];
    
    if (n > 0 && A[0].length !== n) {
        throw '"A" must be a n-by-n matrix.';
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
    
    // --- Gaussian elimination
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
    
    // --- Back substitution
    for (i = n-1; i >= 0; i--) {
        x[i] = b[p[i]];
        for (j = i+1; j <= n-1; j++) {
            x[i] -= A[p[i]][j] * x[j];
        }
        x[i] /= A[p[i]][i];
    }
    
    /* 
    // explicit written out back substitution for a 4-by-4 matrix 
    // (without permutation vector for readability)
    x[3] = ( b[3]                                                    ) / A[3][3];
    x[2] = ( b[2] - A[2][3] * x[3]                                   ) / A[2][2];
    x[1] = ( b[1] - A[1][3] * x[3] - A[1][2] * x[2]                  ) / A[1][1];
    x[0] = ( b[0] - A[0][3] * x[3] - A[0][2] * x[2] - A[0][1] * x[1] ) / A[0][0];
    */
    
    return x;
};

/**
 * Linear least squares
 */
//FIXME: need residuals etc
linalg.leastsq = function (A, b) {
    var AT = linalg.transpose(A);
    var ATA = linalg.mmMult(AT, A);
    var ATb = linalg.mvMult(AT, b);
    return linalg.solve(ATA, ATb);
};


