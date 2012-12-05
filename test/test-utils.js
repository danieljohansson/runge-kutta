var Test = (function () {
    
    // Approximately equal to (with configurable tolerance)
    var approx = function (a, b, tol) {
        tol || (tol = 1e-2);
        return Math.abs(a - b) < tol;
    };
    
    // Compare matrices
    var matrixApprox = function (A, B, tol) {
        var i, j;
        
        if (A.length !== B.length || A[0].length !== B[0].length) {
            return false;
        }
        
        for (i = 0; i < A.length; i++) {
            for (j = 0; j < A[0].length; j++) {
                if (!approx(A[i][j], B[i][j], tol)) {
                    return false;
                }
            }
        }
        return true;
    };
    
    // Compare arrays
    var arrayApprox = function (a, b, tol) {
        var i;
        
        if (a.length !== b.length) {
            return false;
        }
        
        for (i = 0; i < a.length; i++) {
            if (!approx(a[i], b[i], tol)) {
                return false;
            }
        }
        return true;
    };
    
    
    
    var testList = document.querySelector('#results');
    
    var runTests = function (name, tests) {
        
        var li = document.createElement('li');
        var ul = document.createElement('ul');
        
        li.textContent = name;
        
        tests.forEach(function (test) {
            var result = document.createElement('li');
            if (test.test()) {
                result.textContent = 'Success - ' + test.name;
                result.classList.add('success');
            }
            else {
                result.textContent = 'Faliure - ' + test.name;
                result.classList.add('faliure');
            }
            ul.appendChild(result);
        });
        
        li.appendChild(ul);
        testList.appendChild(li);
    };
    
    return {
        run: runTests,
        approx: approx,
        matrixApprox: matrixApprox,
        arrayApprox: arrayApprox
    };
    
})();