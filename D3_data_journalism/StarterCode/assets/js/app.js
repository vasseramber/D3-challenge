// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(newsData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    newsData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      console.log(data.poverty);
      console.log(data.healthcare);
    });  

    var xLinearScale = d3.scaleLinear()
    .domain([8.5, d3.max(newsData, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(newsData, d => d.healthcare)])
    .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);    
  
  chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

  chartGroup.append("g")
      .call(leftAxis);
      
  var circlesGroup = chartGroup.selectAll("circle").data(newsData).enter()
      
  circlesGroup.append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "15")
      .attr("fill", "pink")
      .attr("opacity", ".5")
      .attr("class","stateCircle")
      .on("click", function(data) {     
        toolTip.show(data,this);
      });
      circlesGroup.append("text")
      .text(function(d){
        return d.abbr;
      })
        .attr("dx", d => xLinearScale(d.poverty))
        .attr("dy", d => yLinearScale(d.healthcare)+10/2.5)
        .attr("font-size","9")
        .attr("class","stateText")
        .on("mouseover", function(data, index) {
          toolTip.show(data,this);
        d3.select(this).style("stroke","#323232")
        })
        .on("mouseout", function(data, index) {
            toolTip.hide(data,this)
         d3.select(this).style("stroke","#e3e3e3")
        });
        chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
      chartGroup.append("g")
        .call(leftAxis);      
      
  var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -20])
      .html(function(d) {
        return (`${d.state}<br>poverty: ${d.poverty}<br>healthcare: ${d.healthcare}`);
      });
      chartGroup.call(toolTip);
      
             
      // Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare");
  
      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty");
    
    });
   