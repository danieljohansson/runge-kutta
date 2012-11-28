var A = [[1,2],[3,4]];
var b = [17,39];

// Ax = B ==> x = [5, 6]

x = linsolve(A, b);

console.log(approx(x[0], 5) && approx(x[1], 6));


//x = linsolve([[1,2,3,4,5],[6,7,8,9,0],[3,4,5,6,7],[2,4,5,6,7],[5,6,7,8,9]], [1,3,5,7,8]); // singular
//console.log(x)

//x = linsolve([[1,2,3,4,5],[6,7,8,9,0],[3,4,5,6,7],[2,4,5,6,7],[5,6,7,4,9]], [1,3,5,7,8]);
//console.log(x)

x = linsolve([[1,2,3,4,5],[8,7,8,9,0],[3,4,15,6,7],[2,4,5,6,7],[5,6,7,8,9]], [1,3,5,7,8])
console.log(x)
console.log(norm([x[0]+2.5 , x[1]-7.0625, x[2]-0.05, x[3]+3.5375, x[4]-0.675]))

var fun = function (x) {
    return [8*x[0] - 4, 2*x[1] + 12, 5*x[2] - 10];
};
x = fsolve(fun, [0, 0, 0]);
console.log(x)