require('../../css/style.css');

const url = 'https://dariazherebtsova.github.io/Responsive_chart/chart_data___.json';
// const url = 'http://localhost:8080/chart_data___.json';
let breakPoint = 768;

let Chart = (function (window, d3) {
	let svg, x, y, xAxis, yAxis, dim, chartWrapper, 
	line1, line2, path1, path2, margin = {}, 
	width, height, touchScale, locator, dots1 = [], dots2 = [];
	let data = [];
	let showLabel = false;

	// d3.json(url).then((rawData) => {
	getData(url).then((rawData) => {	
		const numElements = 20;
		for (let i = 1; i < numElements; i++) {
			data.push({ x: rawData[0].columns[0][i], y0: rawData[0].columns[1][i], y1: rawData[0].columns[2][i] })
		}

		// initialize scales
		const xExtent = d3.extent(data, function (d, i) { return d.x });
		const y0Extent = d3.extent(data, function (d, i) { return d.y0 });
		const y1Extent = d3.extent(data, function (d, i) { return d.y1 });
		const maxValue = d3.max([y0Extent[1], y1Extent[1]]); 
		x = d3.scaleTime().domain(xExtent);
		y = d3.scaleLinear().domain([0, maxValue]);

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

		dots1 = svg.selectAll(".dot.index1")
		.data(data)
		.enter().append("circle")
		.style("stroke", "#FF7F0E")
		.style("fill", "white")
		.attr("class", "dot ")
		.attr("r", 5);
		dots1.on('mouseover', onMouseOver);

		dots2 = svg.selectAll(".dot.index2")
		.data(data)
		.enter().append("circle")
		.style("stroke", "#FF7F0E")
		.style("fill", "white")
		.attr("class", "dot ")
		.attr("r", 5);
		dots2.on('mouseover', onMouseOver);

		locatorLine = chartWrapper.append('line')
			.style('display', 'none')
			.classed("locator-line", true)	

		//render the chart
		render();
	});

	function getData(url) {
		return fetch(url)
        	.then((response) => response.json())
        	.then((books) => books)
	};

	function onMouseOver() {
		var xPos = d3.mouse(this)[0];
		var d = data[~~touchScale(xPos)];
		locatorLine
			.attr("x1", x(new Date(d.x)))
			.attr("y1", 0)
			.attr("x2", x(new Date(d.x)))
			.attr("y2", height)
			.style('display', 'block');

		showLabel = true;
		const textLabel = (new Date(d.x)).toDateString();
		const left = Math.ceil(x(new Date(d.x))) + 15;
		d3.select('.label')
			.style('left', `${left}px`)
			.style('opacity', 1)

		d3.select('.data')
			.text(textLabel)

		d3.select('.green')
			.text(d.y0)	
			
		d3.select('.red')
			.text(d.y1)	

	};

	function render() {
		if (showLabel) {
			locatorLine
				.style('display', 'none')
			d3.select('.label')
				.style('opacity', 0)
		}
			
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

		yAxis.scale(y)
			.ticks(6);

		svg.select('.x.axis')
			.attr('transform', 'translate(0,' + height + ')')
			.call(xAxis);

		svg.select('.y.axis')
			.call(yAxis);
  
		const gridLine = svg.selectAll("g.y.axis g.tick")
		.append("line")
		.classed("grid-line", true)
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", width)
		.attr("y2", 0);	

		path1.attr('d', line1);
		path2.attr('d', line2);

		dots1
		.attr('cx', (function (d) { return x(new Date(d.x))+margin.left }))
		.attr('cy', (function (d) { return y(d.y0)+margin.top }));

		dots2
		.attr('cx', (function (d) { return x(new Date(d.x))+margin.left }))
		.attr('cy', (function (d) { return y(d.y1)+margin.top }));
		
	}

	function updateDimensions(winWidth) {
		winWidth = winWidth < 350 ? 350 : winWidth;
		margin.top = 20;
		margin.right = winWidth < breakPoint ? 25 : 50;
		margin.left = winWidth < breakPoint ? 25 : 50;
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
