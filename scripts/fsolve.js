var fun;

/*// test on linear system
console.log(fsolve(function (x) { return [8*x[0]-4, 2*x[1]+12, 5*x[2]-10];}, [0, 0, 0]));
//*/

/*// same as tbv-labb 3
fun = function (a) {
    var p = [72, 83, 98];
    var r = [3e-2, 5e-2, 7e-2];
    return [
        a[0] * Math.exp(a[1] * r[0]) + a[2] * r[0] - p[0],
        a[0] * Math.exp(a[1] * r[1]) + a[2] * r[1] - p[1],
        a[0] * Math.exp(a[1] * r[2]) + a[2] * r[2] - p[2]
    ];
};

console.log('[1, 10, 1] -->', fsolve(fun, [1, 10, 1]));
console.log('[1, 1, 1] -->', fsolve(fun, [1, 1, 1]));
console.log('[1, 1, 1000] -->', fsolve(fun, [1, 1, 1000]));
console.log('[10, 10, 1000] -->', fsolve(fun, [10, 10, 1000]));
//*/

/*// Multilateration
fun = function (x) {
    var fi = function (x, p, tao) {
        return Math.sqrt(x[0]*x[0] + x[1]*x[1] + x[2]*x[2]) - 
               Math.sqrt(Math.pow(x[0]-p[0], 2) + 
                         Math.pow(x[1]-p[1], 2) + 
                         Math.pow(x[2]-p[2], 2)) + 
               tao;
    };
    return [
        fi(x, [0, 0, 2], -0.9070182),
        fi(x, [-2, 5, 0], 2.6007236),
        fi(x, [3, 3, -4], 5.7596779)
    ];
};
console.log(fsolve(fun, [1, -4, 2]));
//*/

/*
Matlab:
fun = @(x) [sqrt(x(1)^2+x(2)^2+x(3)^2)-sqrt(x(1)^2+x(2)^2+(x(3)-2)^2)-0.9070182;sqrt(x(1)^2+x(2)^2+x(3)^2)-sqrt((x(1)+2)^2+(x(2)-5)^2+x(3)^2)+2.6007236;sqrt(x(1)^2+x(2)^2+x(3)^2)-sqrt((x(1)-3)^2+(x(2)-3)^2+(x(3)+4)^2)+5.7596779]
fsolve(fun, [1 -4 2])
*/


// http://www.walkingrandomly.com/?p=1488

fun = function (x) {
    return [
        Math.exp( -x[0]) + sinh(2*x[1]) + tanh(2*x[2]) - 5.01,
        Math.exp(2*x[0]) + sinh( -x[1]) + tanh(2*x[2]) - 5.85,
        Math.exp(2*x[0]) + sinh(2*x[1]) + tanh( -x[2]) - 8.88
    ];
};
console.log('[0, 0, 0] -->', fsolve(fun, [0, 0, 0])); // [NaN, NaN, NaN]
console.log('[1, 1, 1] -->', fsolve(fun, [1, 1, 1])); // [0.900051777077648, 1.0001834566735, 1.0945008740933069]
