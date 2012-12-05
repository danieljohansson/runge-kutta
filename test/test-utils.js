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