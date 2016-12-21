var dataset;

const LINECHART_DIV_SELECTOR = "#DIV4";

const dummyMetric1 = "OVERALL";
const dummyMetric2 = "EXTERNAL_CONFLICTS";


var lineChartMargin = {top: 20, right: 0, bottom: 30, left: 50},
    lineChartWidth = 700 - lineChartMargin.left - lineChartMargin.right,
    lineChartHeight = 280 - lineChartMargin.top - lineChartMargin.bottom;

var lineLegendMargin = {top: 20, right: 90, bottom: 30, left: 0},
    lineLegendWidth = 100 - lineLegendMargin.left - lineLegendMargin.right,
    lineLegendHeight = 280 - lineLegendMargin.top - lineLegendMargin.bottom;

var lineChartSVG;
var lineChartMetrics = [];

var lineLegendSvg;
var lineLegendSpacing = 5;
var lineLegendSquare = 13;
var lineLegendPadding = lineChartWidth + 3 * lineLegendSpacing ; 

var lineSelectedMetrics = [];

var genColorIndex = 0;
var availableColors = ['#7fc97f','#beaed4','#fdc086','#ffff99','#386cb0','#f0027f','#bf5b17'];

var lineChartTooltip = d3.select("body")
        .append("div")
        .classed("map-tooltip", true)
        .style("position", "absolute")
        .style("z-index", "10")
        .style("opacity", "0");

function parseMetricsForCountry (metric, country) {
    metricValues = dataset[country][metric];
    parsedValues = [];

    for (year in metricValues) {
        var value = metricValues[year];
        parsedValues.push(
            {"year" : year,
            "truValue": value,
             "value":  METRICS[metric].scale ? METRICS[metric].scale(value).toFixed(3) : value,
            }
        );
    }

    return parsedValues;
}    

d3.json("dataset.json", function (data) {
    dataset = data;
    genMultiLineChart();
})

function genMultiLineChart(){

    lineChartIdiomSVG = d3.select(LINECHART_DIV_SELECTOR)
                        .append("svg")
                        .attr("width", lineChartWidth + lineChartMargin.left + lineChartMargin.right + lineLegendWidth + lineChartMargin.left + lineLegendMargin.right)
                        .attr("height", lineChartHeight + lineChartMargin.top + lineChartMargin.bottom)

    lineChartSVG = lineChartIdiomSVG
                        .append("g")
                        .attr("transform", "translate(" + lineChartMargin.left + "," + lineChartMargin.top + ")");

    

    var x = d3.scaleTime()
    .rangeRound([0, lineChartWidth]);

    var y = d3.scaleLinear()
    .rangeRound([0, lineChartHeight]);

    x.domain([2008, 2014]);
    y.domain([1,5]);

    var line = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.value); });

    lineChartSVG.append("g")
            .attr("class", "axis line-chart-axis-x")
            .attr("transform", "translate(0," + lineChartHeight + ")")
            .call(
                d3.axisBottom(x)
                .tickFormat(d3.format("d"))
                .tickValues([2008, 2009, 2010, 2011, 2012, 2013, 2014]))
            .append("text")
            .attr("class", "label")
            .attr("x", lineChartWidth)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Year");

     lineChartSVG.append("g")
      .attr("class", "axis line-chart-axis-x")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Value");
    
    drawLineForMetric("PRT", dummyMetric1);

    drawLineLegend();

}

function drawLineLegend() {

    lineLegendSquaresSVG = lineChartSVG.selectAll(".lineLegendSquare")
                            .data(lineChartMetrics, d => d.id)

    var squares = lineLegendSquaresSVG.enter()
                        .append("rect")
                        .attr("class", "lineLegendSquare")
                        .attr("y", d => metricIndex(d.id) * 17)
                        .attr("x", lineLegendPadding)
                        .attr("width", lineLegendSquare)
                        .attr("height", lineLegendSquare)
                        .attr("fill", d => d.color)
                        .style("opacity", "0")
                        .on("mouseover", legendHoverOn)
                        .on("mouseout", legendHoverOff)
                        .on("click", legendClick)
                        .transition().duration(500)
                        .style("opacity", "1");

    lineLegendSquaresSVG.transition().duration(700)
                        .attr("y", d => metricIndex(d.id) * 17);

    lineLegendSquaresSVG.exit().transition().duration(700).style("opacity", "0").remove();


    lineLegendLabelsSVG = lineChartSVG.selectAll(".lineLegend")
                            .data(lineChartMetrics, d => d.id)

    lineLegendLabelsSVG.enter()                            
                        .append("text")
                        .attr("x", lineLegendPadding + lineLegendSquare + lineLegendSpacing)
                        .attr("y", d => metricIndex(d.id) * 17 + lineLegendSquare * 0.75)
                        .style("opacity", "0")
                        .text(d => METRICS[d.id].name)
                        .on("mouseover", legendHoverOn)
                        .on("mouseout", legendHoverOff)
                        .on("click", legendClick)                        
                        .transition().duration(500)
                        .style("opacity", "1")
                        .attr("class", "lineLegend mono");
                    
    lineLegendLabelsSVG .transition().duration(700)
                        .attr("y", d => metricIndex(d.id) * 17 + lineLegendSquare * 0.75);

    lineLegendLabelsSVG.exit().transition().duration(700).style("opacity", "0").remove();


}

function drawLineForMetric(country, metric) {
     var x = d3.scaleTime()
    .rangeRound([0, lineChartWidth]);

    var y = d3.scaleLinear()
    .rangeRound([lineChartHeight, 0]);

    x.domain([2008, 2014]);
    y.domain([5,1]);

    var line = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.value); });

    lineChartSVG.selectAll(".metricLine")
        .data(lineChartMetrics, d => d.id)
        .enter()
        .append("path")
        .attr("class", "line metricLine")
        .attr("d", function(d) { return line(d.data)})
        .style("stroke", d => d.color)
        .style("stroke-width", "3px")
        .style("border", "10px solid #fff")
        .style("opacity", "0")
        .on("mouseover", lineHoverOn)
        .on("mouseout", lineHoverOff)
        .on("click", lineClick)
        .on("mousemove", function(){return lineChartTooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");}) 
        .transition().duration(500)
        .style("opacity", "1")
        ;
    
    lineChartSVG.selectAll(".metricLine")
        .data(lineChartMetrics, d => d.id)
        .exit().transition().duration(700)
        .style("opacity", "0")
        .remove();

        lineChartSVG.selectAll(".metricDots")
                .data(lineChartMetrics, d => d.id)
                .enter()
                .append("g")
                .attr("class", "metricDots")
                    .selectAll(".metricDot")
                    .data(parseDataForDots).enter()
                    .append("circle")
                    .attr('class', "metricDot")
                    .attr('cx', function(d) { return x(d.year); })
                    .attr('cy', function(d) { return y(d.value); })
                    .attr('r', 5)
                    .attr('fill', d => d.color)
                    .style("opacity", "0")
                    .on("mouseover", dotHoverOn)
                    .on("mouseout", dotHoverOff)
                    .on("click", dotClick)
                    .transition().duration(500)
                    .style("opacity", "1")

        lineChartSVG.selectAll(".metricDots")
                    .data(lineChartMetrics, d => d.id)
                    .exit().transition().duration(700)
                    .style("opacity", "0")
                    .remove();
        
}

function parseDataForDots(d) {
    var output = [];

    for (e in d.data) {
        point = d.data[e];
        point["id"] = d.id;
        point["color"] = d.color;
        output.push(point);
    }

    console.log(output);
    return output;
}

function rentColor() {
    var color =  availableColors[0];
    availableColors.splice(0,1); 
    return color;

    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function returnColor(color) {
    availableColors.push(color);
}

dispatcher.on("metricSelected.linechart", function(e) { //debugger
    console.log(lineChartMetrics);
    var index = metricIndex(e.metric_code);
    if (index != -1) {
        returnColor(lineChartMetrics[index].color)
        lineChartMetrics.splice(index, 1);
    } else {
        lineChartMetrics.push({"country": "PRT", "id": e.metric_code, "color": rentColor(), "data": parseMetricsForCountry(e.metric_code, "PRT")});    
    }
    drawLineForMetric("PRT", e.metric_code);
    drawLineLegend();
});

function metricIndex(metricName) {
    var index = -1;
    for (var i = 0; i < lineChartMetrics.length; i++) {
        if (lineChartMetrics[i].id == metricName) {
            index = i;
        }
    }
    return index;
}

function legendHoverOn(c) {
    d3.selectAll(".metricLine").filter(d => (d.id == c.id || isMetricSelected(d.id))).classed("faded", false);
    d3.selectAll(".lineLegendSquare").filter(d => (d.id == c.id || isMetricSelected(d.id))).classed("faded", false)
    d3.selectAll(".metricDots").filter(d => (d.id == c.id || isMetricSelected(d.id))).classed("faded", false);

    d3.selectAll(".metricLine").filter(d => (d.id != c.id && !isMetricSelected(d.id))).classed("faded", true);
    d3.selectAll(".lineLegendSquare").filter(d => (d.id != c.id && !isMetricSelected(d.id))).classed("faded", true)
    d3.selectAll(".metricDots").filter(d => (d.id != c.id && !isMetricSelected(d.id))).classed("faded", true);
}

function legendHoverOff(c) {
    if (lineSelectedMetrics.length == 0) {
        d3.selectAll(".metricLine").classed("faded", false);
        d3.selectAll(".metricDots").classed("faded", false);
        d3.selectAll(".lineLegendSquare").classed("faded", false);
    } else {
        d3.selectAll(".metricLine").filter(d => isMetricSelected(d.id)).classed("faded", false);
        d3.selectAll(".metricDots").filter(d => isMetricSelected(d.id)).classed("faded", false);
        d3.selectAll(".lineLegendSquare").filter(d => isMetricSelected(d.id)).classed("faded", false);

        d3.selectAll(".metricLine").filter(d => !isMetricSelected(d.id)).classed("faded", true);
        d3.selectAll(".metricDots").filter(d => !isMetricSelected(d.id)).classed("faded", true);
        d3.selectAll(".lineLegendSquare").filter(d => !isMetricSelected(d.id)).classed("faded", true);
    }

}

function legendClick(c) {
    if (isMetricSelected(c.id)) {
        index = lineSelectedMetrics.indexOf(c.id);
        lineSelectedMetrics.splice(index, 1);
        d3.selectAll(".lineLegend").filter(d => d.id == c.id).classed("selectedLabel", false);
    } else {
        lineSelectedMetrics.push(c.id);
        d3.selectAll(".lineLegend").filter(d => d.id == c.id).classed("selectedLabel", true);        
    }
}

function lineHoverOn(c) {
    legendHoverOn(c)
    lineChartTooltip.html("<p>" + METRICS[c.id].name + "</p>");
    lineChartTooltip.transition().duration(300).style("opacity", "0.9");
    lineChartTooltip.style("left", (d3.event.pageX) + "px")		
    lineChartTooltip.style("top", (d3.event.pageY - 28) + "px");	
}


function lineHoverOff(c) {
    legendHoverOff(c);
    lineChartTooltip.transition().duration(400).style("opacity", "0");

}

function lineClick(c) {legendClick(c)}

function dotHoverOn(c) {
    d3.selectAll(".metricDot").filter(d => d.id == c.id && d.year == c.year)
            .transition().duration(200)
            .attr("r", 8);

    legendHoverOn(c)
    lineChartTooltip.html(
        "<p>" + METRICS[c.id].name + "</p>" +
        "<p>Year: " + c.year + "</p>" +        
        "<p>Value: " + c.value  + "<p>"
        );
    lineChartTooltip.transition().duration(300).style("opacity", "0.9");
    lineChartTooltip.style("left", (d3.event.pageX + 10) + "px")		
    lineChartTooltip.style("top", (d3.event.pageY + 10) + "px");	
}
function dotHoverOff(c) {
    legendHoverOff(c);
    d3.selectAll(".metricDot").transition().duration(200).attr("r", 5);
    lineChartTooltip.transition().duration(400).style("opacity", "0");
}
function dotClick(c) {legendClick(c)}

function isMetricSelected(metric) {
    return lineSelectedMetrics.indexOf(metric) == -1 ? false : true;
}
