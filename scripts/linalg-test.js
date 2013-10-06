//* / linalg.solve

var b = [1,3,5,7,8];

// singular
var A1 = [[1,2,3,4,5],[6,7,8,9,0],[3,4,5,6,7],[2,4,5,6,7],[5,6,7,8,9]];
console.log(linalg.solve(A1, b));

var A2 = [[1,2,3,4,5],[6,7,8,9,0],[3,4,5,6,7],[2,4,5,6,7],[5,6,7,4,9]];
console.log(linalg.solve(A2, b));

var A3 = [[1,2,3,4,5],[8,7,8,9,0],[3,4,15,6,7],[2,4,5,6,7],[5,6,7,8,9]];
console.log(linalg.solve(A3, b));

// */


var size = 4e2;
var A = linalg.randMatrix(size);
var B = linalg.randMatrix(size);
var b = linalg.randVector(size);

var C1 = linalg.mmMult(A, B);
var C2 = linalg.mmMultTyped(A, B);

console.log(C1[23][213]);
console.log(C2[23][213]);


console.log(matrixPrettyPrint(linalg.randMatrix(5)))
//console.log(linalg.solve(A, b));


// ----- Linear regression -----
function rand(min, max) {
	return min + Math.random() * (max - min);
}
var rand11 = () => rand(-1, 1);

// data set
var N = 10;
var X = [];
for (var i = 0; i < N; i++) {
	X.push([1, rand11()]);
}
var y = [];
for (var i = 0; i < N; i++) {
	y.push([rand11()]);
}

// plot
var plot = new Plot()
	.options({axes: true, xTicks: 5, yTicks: 5, crosshair: true})
	.limits(-1, 1, -1, 1);

plot.plot(linalg.transpose(X)[1], linalg.transpose(y)[0], 
	{line: false, marker: '.', color: 'tomato'});

// XTXw = XTy
var w = linalg.leastsq(X, y);

var fit = function (x) { return w[0] + w[1] * x; };
plot.plot([-1, 1], [-1, 1].map(fit), {color: 'navy'});
