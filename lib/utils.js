/**
 * Returns an array with n linearly spaced number between a and b
 */
var linspace = function (a, b, n) {
    var step = (b - a) / (n - 1);
    var array = [];
    for (var i = 0; i < n; i++) {
        array.push(a + i * step);
    }
    return array;
};

/**
 * Returns an array with n logarithmically spaced number between a and b
 */
var logspace = function (a, b, n) {
    return linspace(a, b, n).map(function (x) { return Math.pow(10, x); });
};

// some hyperbolic functions
var sinh = function (x) { return (Math.exp(x) - Math.exp(-x)) / 2; };
var cosh = function (x) { return (Math.exp(x) + Math.exp(-x)) / 2; };
var tanh = function (x) { return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));};


// Log ODE solution error to console
var logError = function (name, sol, exact) {
    var solutionError = function (t, y, exact) {
        var err, max = 0;
        for (var i = 1, len = y.length; i < len; i++) {
            err = Math.abs(y[i] - exact(t[i]));
            if (err > max) {
                max = err;
            }
        }
        return {max:max, final:err};
    };
    var pad = function (str, len) {
        str = '' + str;
        return str + Array(len > str.length ? len - str.length + 1 : 0).join(' ');
    };
    
    var error;
    if (sol.y[0].length) { // system
        for (var i = 0; i < sol.y.length;  i++) {
            
            error = solutionError(sol.t, sol.y[i], function (t) {
                return exact(t)[i];
            });
            console.log(pad(name + ' ' + i, 10),
                ' Error max:', pad(error.max, 25),
                ' Error final:', pad(error.final, 25),
                ' Steps:', pad(sol.t.length - 1, 7),
                (sol.evals ? 'Evaluations: ' + sol.evals : '')
            );
        }
    }
    else { // single
        error = solutionError(sol.t, sol.y, exact);
        console.log(pad(name, 10),
            ' Error max:', pad(error.max, 25),
            ' Error final:', pad(error.final, 25),
            ' Steps:', pad(sol.t.length - 1, 7),
            (sol.evals ? 'Evaluations: ' + sol.evals : '')
        );
    }
};

/**
 * Pretty print 2D array
 */
var matrixPrettyPrint = function (arr, maxRows, maxCols) {
    var diagonalEllipsis = String.fromCharCode(0x22F1);
    var verticalEllipsis = String.fromCharCode(0x22EE);
    var horizontalEllipsis = String.fromCharCode(0x22EF);

    var rows = [];
    
    var i;
    var m = arr.length;
    var n = arr[0].length;
    
    maxRows || (maxRows = 8);
    maxCols || (maxCols = 5);
    
    var tooManyRows = m > maxRows;
    var tooManyCols = n > maxCols;
    
    for (i = 0; i < m && i < maxRows; i++) {
        rows[i] = arr[i].slice(0, maxCols).join('\t');
        if (tooManyCols) {
            rows[i] += '\t' + horizontalEllipsis;
        }
    }

    if (tooManyCols && tooManyRows) {
        rows[maxRows] = Array(maxCols+1).join(verticalEllipsis).split('').join('\t');
        rows[maxRows] += '\t' + diagonalEllipsis;
    }
    else if (tooManyRows) {
        rows[maxRows] = Array(n+1).join(verticalEllipsis).split('').join('\t');
    }
    
    return rows.join('\n');
};

