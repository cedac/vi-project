var colorScale = d3.scaleQuantile()
    .domain([1, 5])
    .range(COLORS);

const legendElementWidth = 680/8
const scale_y_padding = 10

var legend = d3.select('#color-scale')
    .selectAll(".color-scale")
    .data([1].concat(colorScale.quantiles()), d => d);

var element = legend
    .enter()
    .append("g")
    .attr("class", "legend");

element
    .append("rect")
    .attr("x", function(d, i) { return 1 + legendElementWidth * i; })
    .attr("y", scale_y_padding)
    .attr("width", legendElementWidth)
    .attr("height", 13)
    .style("fill", function(d, i) { return colorScale(d); });

element
    .append("text")
    .attr("class", "mono")
    .text(function(d) { return "≥ " + d.toFixed(2); })
    .attr("x", function(d, i) { return legendElementWidth * i; })
    .attr("y", 25 + scale_y_padding);

legend
    .exit()
    .remove();