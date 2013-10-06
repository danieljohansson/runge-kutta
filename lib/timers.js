// ----- Timer

window.timers = {};

window.tic = function (name) {
	name || (name = 'Time elapsed');
	timers[name] = { start: window.performance.now() };
};

window.toc = function (name) {
	var time, now = window.performance.now();
	
	name || (name = 'Time elapsed');
	
	time = now - timers[name].start;
	timers[name].end = now;
	timers[name].time = time;
	
	while ( name.length < 13 ) name += ' '; // add spaces for alignment
	console.log(name, ':', Math.round(time), 'ms');
};