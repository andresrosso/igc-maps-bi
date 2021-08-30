import { select, extent } from 'd3';
import { axisLeft as d3_axisLeft } from 'd3';

let margin = {top: 10, right: 30, bottom: 30, left: 40};
let width = 400 - margin.left - margin.right;
let height = 400 - margin.top - margin.bottom;

const svg = select('svg')
	.append('svg')
		.attr("width", width + margin.left + margin.right)
  	.attr("height", height + margin.top + margin.bottom)

const chart = svg.append("g")
  	.attr("transform",
        	"translate(" + margin.left + "," + margin.top + ")");


//einfache Beispiele
//let data = [12,19,11,13,12,22,13,4,15,16,18,19,20,12,11,9];
//let data = [1, 2.4, 3.6, 2.1, 1.2, 5, 15, 4.4, 3.5, 2.6, 17, 18]
let data = [5, 7, 15, 10, 21, 19, 21, 22, 22, 23, 23, 23, 23, 23, 24, 24, 24, 24, 25];

//Problem mit großen Ausreißern
//let data = [1.5, 1.6, 1.9, 2, 2.5, 10];
//let data = data2.map(x => Math.log10(x))

//Beispiel mit großem Array
/*let data = []
for(let i = 0; i < 1000; i++){
  data.push(Math.floor(Math.random() * 100000));
}*/


/*let Scales = {
    lin: "scaleLinear",
    log: "scaleLog"
};

let chartState = {};
let inputData = []
chartState.scale = Scales.lin;*/

var div = d3.select('#container').append('text')
        .attr('class', 'tooltip')
        .style('display', 'none');

function mouseover(){
  div.style('display', 'inline');
}
function mousemove(){
  var d = d3.select(boxplot)
  div
    .html("test")
    .style('left', (d3.event.pageX - 34) + 'px')
    .style('top', (d3.event.pageY - 12) + 'px');
}
function mouseout(){
  div.style('display', 'none');
}

let inputData = []

d3.selectAll(".scaleLinear").on("click", function() {
    //chartState.scale = this.value;
  	inputData = data 
    drawBoxplot(inputData);
});

d3.selectAll(".scaleLog").on("click", function() {
  	//chartState.scale = this.value;
  	inputData = data.map(x => Math.log10(x))
  	drawBoxplot(inputData);
});

let yAxis = d3.scaleLinear()
    .range([height, 0]);

const center = width / 2;
const widthOfRect = 70;

const boxplot = chart.append('g')
      .attr('transform', `translate(${center - widthOfRect/2}, 0)`);

boxplot.append("rect")
	.attr("class", "iqr")
boxplot.append("line")
	.attr("class", "medianLine")
boxplot.append("line")
	.attr("class", "upperWhiskerHor")
boxplot.append("line")
	.attr("class", "upperWhiskerVert")
boxplot.append("line")
	.attr("class", "lowerWhiskerHor")
boxplot.append("line")
	.attr("class", "lowerWhiskerVert")

boxplot.on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseout', mouseout);

//Initial Boxplot
drawBoxplot(data)

function drawBoxplot(data, f) {
  //if (chartState.scale === Scales.lin) {
    //Löschen der Kreise für Outlier
    d3.selectAll("circle").remove()
  	d3.selectAll("#yAxis").remove()
    
    let data_sorted = data.sort(d3.ascending);
		let q1 = d3.quantile(data_sorted, .25);
		let median = d3.quantile(data_sorted, .5);
		let q3 = d3.quantile(data_sorted, .75);
		let interQuantileRange = q3 - q1;
		let lowerIQR = q1 - 1.5 * interQuantileRange;
		let upperIQR = q3 + 1.5 * interQuantileRange;
		let highOutliers = data.filter(outlier => outlier > upperIQR);
		let lowOutliers = data.filter(outlier => outlier < lowerIQR);
    let minimum = d3.min(data)//Math.min.apply(Math, data);
		let maximum = d3.max(data)//Math.max.apply(Math, data);
		
    // .nice() sorgt dafür, dass die Achsen nicht abrupt bei min/max enden
    // extent(data) macht daselbe wie [minimum,maximum]
    yAxis.domain(extent(data)).nice();
    
  	const duration = 500
  
    chart.append('g')
      .attr('id', 'yAxis')
      .transition()
      .duration(duration)
      .call(d3.axisLeft(yAxis).tickSizeOuter(0))

    //Box zwischen q1 und q3
  	d3.select(".iqr")
  		.attr("opacity", 0)
    	.attr("x", 0)
      .attr("y", yAxis(q3) )
      .attr("width", widthOfRect)
  		.attr("height", (yAxis(q1)-yAxis(q3)) )
    	.style("stroke", "black")
  		.transition()
  		.duration(duration)
  		.attr("opacity", 1)
    
    //Medianlinie
    d3.select(".medianLine")
  		.attr("opacity", 0)
  		.attr("y1", yAxis(median))
  		.attr("y2", yAxis(median))
  		.attr("x1", 0)
      .attr("x2", widthOfRect)
    	.style("stroke", "black")
  		.transition()
  		.duration(duration)
  		.attr("opacity", 1);
    

    //Whisker oberhalb
    if(maximum < upperIQR){
      d3.select(".upperWhiskerHor")
      		.attr("opacity", 0)
      		.attr("y1", yAxis(q3))
      		.attr("y2", yAxis(maximum))
      		.attr("x1", widthOfRect / 2)
          .attr("x2", widthOfRect / 2)
          .style("stroke", "black")
        	.transition()
  				.duration(duration)
  				.attr("opacity", 1);

      d3.select(".upperWhiskerVert")
      		.attr("opacity", 0)
          .attr("x1", 0)
          .attr("x2", widthOfRect)
          .attr("y1", yAxis(maximum))
          .attr("y2", yAxis(maximum))
          .style("stroke", "black")
      		.transition()
  				.duration(duration)
  				.attr("opacity", 1);

    } else {
     d3.select(".upperWhiskerHor")
      		.attr("opacity", 0)
          .attr("x1", widthOfRect / 2)
          .attr("x2", widthOfRect / 2)
          .attr("y1", yAxis(q3))
          .attr("y2", yAxis(upperIQR))
          .style("stroke", "black")
      		.transition()
  				.duration(duration)
  				.attr("opacity", 1);

      d3.select(".upperWhiskerVert")
      		.attr("opacity", 0)
          .attr("x1", 0)
          .attr("x2", widthOfRect)
          .attr("y1", yAxis(upperIQR))
          .attr("y2", yAxis(upperIQR))
          .style("stroke", "black")
      		.transition()
  				.duration(duration)
  				.attr("opacity", 1);
    }

    //Whisker unterhalb
    if(minimum > lowerIQR){
      d3.select(".lowerWhiskerHor")
      		.attr("opacity", 0)
          .attr("x1", widthOfRect / 2)
          .attr("x2", widthOfRect / 2)
          .attr("y1", yAxis(q1))
          .attr("y2", yAxis(minimum))
          .style("stroke", "black")
      		.transition()
  				.duration(duration)
  				.attr("opacity", 1);

      d3.select(".lowerWhiskerVert")
      		.attr("opacity", 0)
          .attr("x1", 0)
          .attr("x2", widthOfRect)
          .attr("y1", yAxis(minimum))
          .attr("y2", yAxis(minimum))
          .style("stroke", "black")
      		.transition()
  				.duration(duration)
  				.attr("opacity", 1);

    } else {
     d3.select(".lowerWhiskerHor")
      		.attr("opacity", 0)
          .attr("x1", widthOfRect / 2)
          .attr("x2", widthOfRect / 2)
          .attr("y1", yAxis(q1))
          .attr("y2", yAxis(lowerIQR))
          .style("stroke", "black")
      		.transition()
  				.duration(duration)
  				.attr("opacity", 1);

    d3.select(".lowerWhiskerVert")
      		.attr("opacity", 0)
          .attr("x1", 0)
          .attr("x2", widthOfRect)
          .attr("y1", yAxis(lowerIQR))
          .attr("y2", yAxis(lowerIQR))
          .style("stroke", "black")
      		.transition()
  				.duration(duration)
  				.attr("opacity", 1);
    }

    //Outlier oberhalb
    let circleSize = 3;

    for(let outlier in highOutliers){
      boxplot
        .append("circle")
      		.attr("class", "highOutlier")
          .attr("cy", yAxis(highOutliers[outlier]))
          .attr("cx", widthOfRect / 2)
          .attr('r', circleSize)
          .style("stroke", "black")
      		.transition()
  				.duration(duration)
  				.attr("opacity", 1); 		
    }

    //Outlier unterhalb
    for(let outlier in lowOutliers){
      boxplot
        .append("circle")
      		.attr("class", "lowOutlier")
          .attr("cy", yAxis(lowOutliers[outlier]))
          .attr("cx", widthOfRect / 2)
          .attr('r', circleSize)
          .style("stroke", "black")
      		.transition()
  				.duration(duration)
  				.attr("opacity", 1); 		
    }
  //}
}