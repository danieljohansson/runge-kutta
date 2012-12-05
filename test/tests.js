var nderivTests = [{
        name: 'nderiv (undefined order ==> 4) sin',
        test: function () { return nderiv(Math.sin, 3, 1e-4) === nderiv(Math.sin, 3, 1e-4)}
    }, {
        name: 'nderiv (order 1) exp',
        test: approx.bind(this, nderiv(Math.exp, 3, 1e-4, 1), Math.exp(3))
    }, {
        name: 'nderiv (order 2) exp',
        test: approx.bind(this, nderiv(Math.exp, 3, 1e-3, 2), Math.exp(3))
    }, {
        name: 'nderiv (order 4) exp',
        test: approx.bind(this, nderiv(Math.exp, 3, 1e-2, 4), Math.exp(3))
    }, {
        name: 'nderiv (order 6) exp',
        test: approx.bind(this, nderiv(Math.exp, 3, 1e-1, 6), Math.exp(3))
    }
];
runTests('nderiv', nderivTests);

var linalgTests = [{
        name: 'transpose',
        test: function () {
            return false;
        }
    }
];
runTests('linalg', linalgTests);