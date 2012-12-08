
/**
 * Finite difference methods of order 1, 2, 4 or 6 (default is 4)
 */
var diff = function (f, x, h, order) {
    switch (order) {
        case 1:
            return (f(x+h) - f(x)) / h;
        case 2:
            return (f(x+h) - f(x-h)) / (2*h);
        case undefined:
            // fall through
        case 4:
            return (f(x-2*h) - 8*f(x-h) + 8*f(x+h) - f(x+2*h)) / (12*h);
        case 6:
            return (f(x+3*h) - 9*f(x+2*h) + 45*f(x+h) - 45*f(x-h) + 9*f(x-2*h) - f(x-3*h)) / (60*h);
        default:
            throw "Only orders 1, 2, 4 and 6 are supported.";
    }
};