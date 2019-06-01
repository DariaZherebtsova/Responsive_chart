require('../../css/style.css');

var Chart = (function(window,d3) {
  let svg, data, x, y, xAxis, yAxis, dim, chartWrapper, line, path, margin = {}, width, height;
  console.log("start5");
  
  d3.json("http://localhost:8080/chart_data___.json").then(function(rawData) {
    console.log('data', rawData); 
    // const x = rawData[0].columns[0].shift();
    // const y = rawData[0].columns[1].shift();
    // const data =  x.map( (item, i) => {
    //   return { x: item, y:  y[i] };
    // });
    let data = []; 
    const numElements = 20;
    for (let i = 1; i < numElements; i++)
    {
      data.push({ x: rawData[0].columns[0][i], y0: rawData[0].columns[1][i] })
    }

    console.log('pure data', data);
    //initialize scales
	  xExtent = d3.extent(data, function(d,i) { return d.x });
	  yExtent = d3.extent(data, function(d,i) { return d.y0 });
	  x = d3.scaleTime().domain(xExtent);
	  y = d3.scaleLinear().domain(yExtent);
  
	  //initialize axis
	  xAxis = d3.axisBottom();
	  yAxis = d3.axisLeft();
  
	  //the path generator for the line chart
	  line = d3.line()
		.x(function(d) { return x(new Date(d.x)) })
		.y(function(d) { return y(d.y0) });
  
	  //initialize svg
	  svg = d3.select('#chart').append('svg');
	  chartWrapper = svg.append('g');
	  path = chartWrapper.append('path').datum(data).classed('line', true);
	  chartWrapper.append('g').classed('x axis', true);
	  chartWrapper.append('g').classed('y axis', true);
  
	  //render the chart
	  render();
  });

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
	  xAxis.scale(x);
	  yAxis.scale(y);
	  
	  svg.select('.x.axis')
		.attr('transform', 'translate(0,' + height + ')')
		.call(xAxis);
  
	  svg.select('.y.axis')
		.call(yAxis);
  
	  path.attr('d', line);
	}
  
  function updateDimensions(winWidth) {
		console.log('updateDimensions', winWidth);
	  margin.top = 20;
	  margin.right = 50;
	  margin.left = 50;
	  margin.bottom = 50;
  
	  width = winWidth - margin.left - margin.right;
	  height = 500 - margin.top - margin.bottom;
	}
  
	return {
	  render : render
	}
})(window,d3);

console.log("I was loded3");