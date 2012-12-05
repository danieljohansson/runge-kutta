var nderivTests = [{
        name: 'nderiv (order 1) exp',
        test: Test.approx.bind(this, nderiv(Math.exp, 3, 1e-4, 1), Math.exp(3))
    }, {
        name: 'nderiv (order 2) exp',
        test: Test.approx.bind(this, nderiv(Math.exp, 3, 1e-3, 2), Math.exp(3))
    }, {
        name: 'nderiv (order 4) exp',
        test: Test.approx.bind(this, nderiv(Math.exp, 3, 1e-2, 4), Math.exp(3))
    }, {
        name: 'nderiv (order 6) exp',
        test: Test.approx.bind(this, nderiv(Math.exp, 3, 1e-1, 6), Math.exp(3))
    }, {
        name: 'nderiv (undefined order == 4) sin',
        test: function () { return nderiv(Math.sin, 3, 1e-4) === nderiv(Math.sin, 3, 1e-4)}
    }
];
Test.run('nderiv', nderivTests);

var linalgTests = [{
        name: 'vector norm',
        test: Test.approx.bind(this, linalg.norm([1,2,-3, 1, -1]), 4)
    }, {
        name: 'transpose',
        test: function () {
            var A = [[1,2,3],[4,5,6],[7,8,9]];
            var T = [[1,4,7],[2,5,8],[3,6,9]];
            return Test.matrixApprox(linalg.transpose(A), T);
        }
    }, {
        name: 'matrix vector multiplication',
        test: function () {
            var A = [[1,2],[3,4]];
            var b = [5,6];
            var c = [17,39];
            return Test.arrayApprox(linalg.mvMult(A, b), c);
        }
    }, {
        name: 'matrix matrix multiplication',
        test: function () {
            var A = [[1,-2,3],[-4,5,-6]];
            var B = [[-1,2],[-3,4],[-5,6]];
            var C = [[-10,12],[19,-24]];
            return Test.matrixApprox(linalg.mmMult(A, B), C);
        }
    }
];
Test.run('linalg', linalgTests);

var linsolveTests = [{
        name: 'linsolve',
        test: function () {
            var A = [[1,2],[3,4]];
            var b = [17,39];
            // Ax = B ==> x = [5, 6]
            x = linsolve(A, b);
            return Test.approx(x[0], 5) && Test.approx(x[1], 6);
        }
    }
];
Test.run('linsolve', linsolveTests);