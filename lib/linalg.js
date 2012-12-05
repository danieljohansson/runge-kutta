var linalg = {};


/** 
 * Euclidian vector norm 
 */
linalg.norm = function (x) {
    var i, len = x.length, sqSum = 0;
    for (i = 0; i < len; i++) {
        sqSum += x[i] * x[i];
    }
    return Math.sqrt(sqSum);
};

/**
 * Matrix transpose of A
 */
linalg.transpose = function (A) {
    var m = A.length, n = A[0].length;
    var i, j;
    var T = [];
    
    for (j = 0; j < n; j++) {
        T[j] = [];
        for (i = 0; i < m; i++) {
            T[j][i] = A[i][j];
        }
    }
    return T;
};

/**
 * Matrix vector multiplication
 */
linalg.mvMult = function (A, b) {
    
	var m = A.length; // rows
	var n = A[0].length; // cols
    var i, j, ans = [];
    
	if (b.length !== n) {
		throw new Error('Matrix dimensions must agree.');
	}
    
	for (i = 0; i < m; i++) {
        ans[i] = 0;
		for (j = 0; j < n; j++) {
			ans[i] += A[i][j] * b[j];
		}
	}
    return ans;
};

/**
 * Matrix matrix multiplication
 */
linalg.mmMult = function (A, B) {
    
    var rowsA = A.length;
	var colsA = A[0].length;
    var rowsB = B.length;
	var colsB = B[0].length;
    var i, j, k, ans = [];
    
	if (colsA !== rowsB) {
		throw new Error('Matrix dimensions must agree.');
	}
    
	for (i = 0; i < rowsA; i++) {
        ans[i] = [];
        for (j = 0; j < colsB; j++) {
            ans[i][j] = 0;
            for (k = 0; k < colsA; k++) {
                ans[i][j] += A[i][k] * B[k][j];
            }
        }
	}
    return ans;
};





