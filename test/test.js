var tests = [{
        name: 'nderiv (undefined order) exp',
        test: approx.bind(this, nderiv(Math.exp, 3, 1e-2), Math.exp(3))
    }, {
        name: 'nderiv (order 4 == undef) sin',
        test: function () { return nderiv(Math.sin, 3, 1e-4, 4) === nderiv(Math.sin, 3, 1e-4)}
    }, {
        name: 'nderiv (order 1) exp',
        test: approx.bind(this, nderiv(Math.exp, 3, 1e-4, 1), Math.exp(3))
    }, {
        name: 'nderiv (order 2) exp',
        test: approx.bind(this, nderiv(Math.exp, 3, 1e-3, 2), Math.exp(3))
    }, {
        name: 'nderiv (order 6) exp',
        test: approx.bind(this, nderiv(Math.exp, 3, 1e-1, 6), Math.exp(3))
    }
];

var testList = document.querySelector('#results');

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
    testList.appendChild(result);
});