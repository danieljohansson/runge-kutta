var diffTests = [{
        name: 'diff (order 1) exp',
        test: Test.approx.bind(this, diff(Math.exp, 3, 1e-4, 1), Math.exp(3))
    }, {
        name: 'diff (order 2) exp',
        test: Test.approx.bind(this, diff(Math.exp, 3, 1e-3, 2), Math.exp(3))
    }, {
        name: 'diff (order 4) exp',
        test: Test.approx.bind(this, diff(Math.exp, 3, 1e-2, 4), Math.exp(3))
    }, {
        name: 'diff (order 6) exp',
        test: Test.approx.bind(this, diff(Math.exp, 3, 1e-1, 6), Math.exp(3))
    }, {
        name: 'diff (undefined order == 4) sin',
        test: function () { return diff(Math.sin, 3, 1e-4) === diff(Math.sin, 3, 1e-4)}
    }
];
Test.run('diff', diffTests);

var numToStrTests = [{
        name: 'all',
        test: function () {
            var tests = [
                [2345678, '2346000'],
                [0.05, '0.05'],
                [0.12, '0.12'],
                [0.00023412, '2.341e-4'],
                [78.97769e-9, '7.898e-8'],
                [-653.8924658e5, '-6.539e7'],
                [1234, '1234'],
                [12345, '12350'],
                [1e2, '100'],
                [1e3, '1000'],
                [1e4, '10000'],
                
                [1e-4, '1e-4'],
                [1e-3, '0.001'],
                [1e-2, '0.01'],
                [1e-1, '0.1'],
                [1e3 + 1e-11, '1000'],
                [1e6, '1000000'],
                [1e7, '1e7'],
                
                [NaN, 'NaN'],
                ['string', 'NaN'],
                [Infinity, 'Infinity'],
                [-Infinity, '-Infinity']
            ];
            for (var i = 0; i < tests.length; i++) {
                if (numToStr(tests[i][0]) !== tests[i][1]) {
                    console.warn('Faliure:', numToStr(tests[i][0]), tests[i][1])
                    return false;
                }
            }
            return true;
        }
    }
];
Test.run('numToStr', numToStrTests);

var linalgTests = [{
        name: 'vector norm',
        test: Test.approx.bind(this, linalg.norm([1, 2, -3, 1, -1]), 4)
    }, {
        name: 'transpose',
        test: function () {
            var A = [[1,2,3],[4,5,6],[7,8,9],[10,11,12]];
            var T = [[1,4,7,10],[2,5,8,11],[3,6,9,12]];
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
    }, {
        name: 'linsolve',
        test: function () {
            var A = [[1,2],[3,4]];
            var b = [17,39];
            // Ax = B ==> x = [5, 6]
            x = linalg.solve(A, b);
            return Test.approx(x[0], 5) && Test.approx(x[1], 6);
        }
    }
];
Test.run('linalg', linalgTests);

