
var plot = new Plot();
plot.setSize(600, 400);

plot.plot([-2,15], [7,-1], 'orange', '+');
plot.plot(linspace(-5, 50, 25), linspace(-1, 40, 25), 'blue', 'o');
//plot.plot([-0.000002,0.000015], [0.000007,-0.000001], 'orange', '+');

plot.axisEqual();
plot.axisOn();
plot.crosshairOn();