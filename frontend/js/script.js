require('../../css/style.css');

let breakPoint = 768;

let Chart = (function (window, d3) {
	let svg, x, y, xAxis, yAxis, dim, chartWrapper, line1, line2, path1, path2, margin = {}, width, height, touchScale, locator;
	console.log("start5");
	let data = [];
	d3.json("http://localhost:8080/chart_data___.json").then((rawData) => {
		console.log('data', rawData);
		// let data = []; 
		const numElements = 20;
		for (let i = 1; i < numElements; i++) {
			data.push({ x: rawData[0].columns[0][i], y0: rawData[0].columns[1][i], y1: rawData[0].columns[2][i] })
		}

		console.log('pure data', data);
		// initialize scales
		// extent возвращает минимальное и максимальное значения в виде массива
		const xExtent = d3.extent(data, function (d, i) { return d.x });
		const y0Extent = d3.extent(data, function (d, i) { return d.y0 });
		const y1Extent = d3.extent(data, function (d, i) { return d.y1 });
		console.log('y0Extent', y0Extent);
		const minValue = d3.min([y0Extent[0], y1Extent[0]]);
		const maxValue = d3.max([y0Extent[1], y1Extent[1]]);
		console.log([maxValue, minValue]);
		//initialize scales  
		x = d3.scaleTime().domain(xExtent);
		y = d3.scaleLinear().domain([maxValue, minValue]);

		//initialize axis
		xAxis = d3.axisBottom();
		yAxis = d3.axisLeft();

		//the path generator for the line chart
		line1 = d3.line()
			.x(function (d) { return x(new Date(d.x)) })
			.y(function (d) { return y(d.y0) });

		line2 = d3.line()
			.x(function (d) { return x(new Date(d.x)) })
			.y(function (d) { return y(d.y1) });	

		//initialize svg
		svg = d3.select('.chart').append('svg');
		chartWrapper = svg.append('g'); //.attr("class", "chart-wrapper");
		path1 = chartWrapper.append('path').datum(data).classed('line line1', true);
		path2 = chartWrapper.append('path').datum(data).classed('line line2', true);
		chartWrapper.append('g').classed('x axis', true);
		chartWrapper.append('g').classed('y axis', true);

		locator = chartWrapper.append('circle')
			.style('display', 'none')
			.attr('r', 10)
			.attr('fill', '#f00');

		chartWrapper.on('mousedown', onMouseDown);

		//render the chart
		render();
	});

	function onMouseDown() {
		var xPos = d3.mouse(this)[0];
		console.log('Click!', xPos);
		var d = data[~~touchScale(xPos)];
		console.log('d', d);
		console.log('d.x', new Date(d.x));
		console.log('d.y', d.y0);
		console.log('locator', locator);
		locator
			.attr('cx', x(new Date(d.x)))
			.attr('cy', y(d.y0))
			.style('display', 'block');
	};

	function render() {
		console.log("***render***", window.innerWidth);
		//get dimensions based on window size
		updateDimensions(window.innerWidth);

		//update x and y scales to new dimensions
		x.range([0, width]);
		y.range([height, 0]);

		//update svg elements to new dimensions
		svg
			.attr('width', width + margin.right + margin.left)
			.attr('height', height + margin.top + margin.bottom);
		chartWrapper.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		//update the axis and line
		if (window.innerWidth > breakPoint) {
			xAxis.scale(x).tickFormat(d3.timeFormat('%a, %b %d'));
		}
		else {
			xAxis.scale(x).tickFormat(d3.timeFormat('%b %d'));
		}
		//yAxis = window.innerWidth < breakPoint ? d3.axisRight() : d3.axisLeft();
		yAxis.scale(y);

		svg.select('.x.axis')
			.attr('transform', 'translate(0,' + height + ')')
			.call(xAxis);

		svg.select('.y.axis')
			.call(yAxis);

		path1.attr('d', line1);
		path2.attr('d', line2);
	}

	function updateDimensions(winWidth) {
		console.log('updateDimensions', winWidth);
		winWidth = winWidth < 350 ? 350 : winWidth;
		margin.top = 20;
		margin.right = winWidth < breakPoint ? 20 : 50;
		margin.left = winWidth < breakPoint ? 20 : 50;
		margin.bottom = 50;

		width = winWidth - margin.left - margin.right;
		height = 500 - margin.top - margin.bottom;

		touchScale = d3.scaleLinear().domain([0, width]).range([0, data.length - 1]).clamp(true);
	}

	return {
		render: render
	}
})(window, d3);

window.addEventListener('resize', Chart.render);
console.log("I was loded5");

function onMouseDown() {
	var xPos = d3.mouse(this)[0];
	console.log('Click!', xPos);
	var d = data[~~Chart.touchScale(xPos)];

	locator.attr({
		cx: x(new Date(d.date)),
		cy: y(d.value)
	})
		.style('display', 'block');
};