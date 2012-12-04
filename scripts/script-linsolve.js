
var A = [[1,2],[3,4]];
var b = [17,39];
// Ax = B ==> x = [5, 6]
x = linsolve(A, b);
console.log(approx(x[0], 5) && approx(x[1], 6));

// singular
//x = linsolve([[1,2,3,4,5],[6,7,8,9,0],[3,4,5,6,7],[2,4,5,6,7],[5,6,7,8,9]], [1,3,5,7,8]); 
//console.log(x)

//x = linsolve([[1,2,3,4,5],[6,7,8,9,0],[3,4,5,6,7],[2,4,5,6,7],[5,6,7,4,9]], [1,3,5,7,8]);
//console.log(x)

console.log(linsolve([[1,2,3,4,5],[8,7,8,9,0],[3,4,15,6,7],[2,4,5,6,7],[5,6,7,8,9]], [1,3,5,7,8]));