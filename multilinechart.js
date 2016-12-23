var dataset;

const LINECHART_DIV_SELECTOR = "#DIV4";

const dummyMetric1 = "OVERALL";
const dummyMetric2 = "EXTERNAL_CONFLICTS";


var lineChartMargin = {top: 15, right: 0, bottom: 30, left: 50},
    lineChartWidth = 700,
    lineChartHeight = 280;

var lineLegendMargin = {top: 20, right: 90, bottom: 30, left: 0},
    lineLegendWidth = 100,
    lineLegendHeight = 270;

var lineChartSVG;
var lineChartMetrics = [];

var lineLegendSvg;
var lineLegendSpacing = 5;
var lineLegendSquare = 13;
var lineLegendPadding = lineChartWidth + 3 * lineLegendSpacing ; 

var lineSelectedMetrics = [];

var genColorIndex = 0;
var availableColors = ['#7fc97f','#beaed4','#fdc086','#ffff99','#386cb0','#f0027f','#bf5b17'];

var currentMetric1;
var currentMetric2;

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
             "value":  (METRICS[metric].scale && value != -1) ? METRICS[metric].scale(value).toFixed(3) : value,
            }
        );
    }

    return parsedValues;
}    

function bootstrap_linechart(d) {
    dataset = d;
    lineChartMetrics.push({"country": COUNTRY1, "id": METRIC1, "color": rentColor(), "data": parseMetricsForCountry(METRIC1, COUNTRY1)});    
    lineChartMetrics.push({"country": COUNTRY1, "id": METRIC2, "color": rentColor(), "data": parseMetricsForCountry(METRIC2, COUNTRY1)});    
    
    currentMetric1 = METRIC1;
    currentMetric2 = METRIC2;
    
    genMultiLineChart();
}

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
            .attr("x", lineChartWidth/2)
            .attr("y", 29)
            .style("text-anchor", "middle")
            .text("Year");

     lineChartSVG.append("g")
      .attr("class", "axis line-chart-axis-x")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "translate(-40, "+lineChartHeight/2+") rotate(-90)")
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .style("text-anchor", "middle")
      .text("Value");
    
    drawLines();
    drawLineLegend();

}

function drawLineLegend() {

    lineLegendSquaresSVG = lineChartSVG.selectAll(".lineLegendSquare")
                            .data(lineChartMetrics, d => d.id)

    var squares = lineLegendSquaresSVG.enter()
                        .append("rect")
                        .attr("class", "lineLegendSquare")
                        .attr("y", d => metricIndex(d.id) * 17 * 2)
                        .attr("x", lineLegendPadding)
                        .attr("width", lineLegendSquare)
                        .attr("height", lineLegendSquare)
                        .attr("fill", d => d.color)
                        .style("opacity", "0")
                        .on("mouseover", legendHoverOn)
                        .on("mouseout", legendHoverOff)
                        .on("click", legendClick)
                        .on('contextmenu', d3.contextMenu(lineChartMenu))
                        .transition().duration(700)
                        .style("opacity", "1")

    lineLegendSquaresSVG.transition().duration(700)
                        .attr("y", d => metricIndex(d.id) * 17 * 2);

    lineLegendSquaresSVG.exit().transition().duration(300).style("opacity", "0").remove();


    lineLegendLabelsSVG = lineChartSVG.selectAll(".lineLegend")
                            .data(lineChartMetrics, d => d.id)


    lineLegendLabelsSVG.enter()                        
                        .append("foreignObject")
                        .attr("x", lineLegendPadding + lineLegendSquare + lineLegendSpacing)
                        .attr("y", d => metricIndex(d.id) * 17 * 2) //+ lineLegendSquare * 0.75)
                        .attr('width', 100)
                        .attr('height', 200)
                        .attr("class", "lineLegend mono")
                        .append('xhtml:p')
                        .text(d => METRICS[d.id].name)
                        .on("mouseover", legendHoverOn)
                        .on("mouseout", legendHoverOff)
                        .on("click", legendClick)
                        .on('contextmenu', d3.contextMenu(lineChartMenu))
                        .style("opacity", "0")                        
                        .style("opacity", "1")
                        ;
                    
    lineLegendLabelsSVG.transition().duration(700)
                        .attr("y", d => metricIndex(d.id) * 17 * 2)// + lineLegendSquare * 0.75);

    lineLegendLabelsSVG.exit().transition().duration(300).style("opacity", "0").remove();

    lineChartSVG.selectAll(".lineChartCountry")
                .data(lineChartMetrics, d => d.country)
                .enter()
                .append("foreignObject")
                .attr("class", "lineChartCountry monoMedium")                
                .attr("x", lineLegendPadding + lineLegendSquare + lineLegendSpacing)
                .attr("y", lineLegendHeight - 10)
                .attr('width', 100)
                .attr('height', 100)
                .append("text")
                .style("opacity", "0")
                .text(d => dataset[d.country].name)
                .transition().duration(700)
                .style("opacity", "1");

    lineChartSVG.selectAll(".lineChartCountry")
                .data(lineChartMetrics, d => d.country)
                .exit().remove();

    lineChartSVG.selectAll(".lineChartCountry")
                .data(lineChartMetrics, d => d.country)
                .style("opacity", "0")
                .text(d => dataset[d.country].name)
                //.transition().duration(700)
                .style("opacity", "1");

    fadeUnselectedMetrics();


}

function getFaded(d) {
  
    if (lineSelectedMetrics.length > 0) {
        if (isMetricSelected(d.id)){
            return ""
        }  else {
            return "faded"
        }
    } else {
        return ""
    }
}

 function removeMissingValues(data) {
        cleanData = []
        for (e in data) {
            if (data[e].value != -1) {
                cleanData.push(data[e]);
            }
        }

        return cleanData;
}    

function drawLines(country, metric) {

     var x = d3.scaleTime()
    .rangeRound([0, lineChartWidth]);

    var y = d3.scaleLinear()
    .rangeRound([lineChartHeight, 0]);

    x.domain([2008, 2014]);
    y.domain([5,1]);

    var line = d3.line()
    .curve(d3.curveLinear)
    .x(function(d) { return x(d.year); })
    .y(function(d) {
            return y(d.value);
    });

   

    lineChartSVG.selectAll(".metricLine")
        .data(lineChartMetrics, d => d.id)
        .enter()
        .append("path")
        .attr("class", "line metricLine")
        .attr("d", function(d) { return line(removeMissingValues(d.data))})
        .style("stroke", d => d.color)
        .style("stroke-width", "2px")
        .on("mouseover", lineHoverOn)
        .on("mouseout", lineHoverOff)
        .on("click", lineClick)
        .on("mousemove", function(){return lineChartTooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");}) 
        .on('contextmenu', d3.contextMenu(lineChartMenu))
        .style("opacity", "0")
        .transition().duration(700)
        .style("opacity", "1");

    lineChartSVG.selectAll(".metricLine")
        .data(lineChartMetrics, d => d.id)
        .exit().transition().duration(300)
        .style("opacity", "0")
        .remove();

    

    lineChartSVG.selectAll(".metricDots")
            .data(lineChartMetrics, d => d.id + ":" + d.country)
            .enter()
            .append("g")
            .attr("class", "metricDots")
                .selectAll(".metricDot")
                .data(parseDataForDots, d => d.year).enter()
                .append("circle")
                .attr('class', "metricDot")
                .attr('cx', function(d) { return x(d.year); })
                .attr('cy', function(d) {return y(d.value);})
                .attr('r', 5)
                .attr('fill', d => d.color)
                .style("opacity", "0")
                .on("mouseover", dotHoverOn)
                .on("mouseout", dotHoverOff)
                .on("click", dotClick)
                .on('contextmenu', d3.contextMenu(lineChartMenu))
                .transition().duration(700)
                .style("opacity", "1")

    lineChartSVG.selectAll(".metricDots")
                .data(lineChartMetrics, d => d.id + ":" + d.country)
                .exit().transition().duration(300)
                .style("opacity", "0")
                .remove();
    
}

function updateLines() {

    var x = d3.scaleTime()
        .rangeRound([0, lineChartWidth]);

    var y = d3.scaleLinear()
        .rangeRound([lineChartHeight, 0]);

    x.domain([2008, 2014]);
    y.domain([5,1]);

    var line = d3.line()
    .curve(d3.curveLinear)
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.value);});

    lineChartSVG.selectAll(".metricLine")
            .data(lineChartMetrics, d => d.id)
            .style("opacity", "1")
            .transition().duration(1000)
            .attr("d", function(d) { return line(removeMissingValues(d.data))});

    lineChartSVG.selectAll(".metricDots")
            .data(lineChartMetrics, d => d.id)
                .selectAll(".metricDot")
                .data(parseDataForDots)
                .filter(d => d.value != -1)
                .style("opacity", "1")
                .transition().duration(1000)
                .style("display", "")
                .attr('cy', function(d) {return y(d.value);});

    lineChartSVG.selectAll(".metricDots")
            .data(lineChartMetrics, d => d.id)
                .selectAll(".metricDot")
                .data(parseDataForDots)
                .filter(d => d.value == -1)
                .style("opacity", "1")
                .transition().duration(700)
                .style("opacity", "0")
                .style("display", "none");    
                
    fadeUnselectedMetrics();
}

function fadeUnselectedMetrics() {
    d3.selectAll(".metricLine").filter(d => (isMetricSelected(d.id))).classed("faded", false);
    d3.selectAll(".lineLegendSquare").filter(d => (isMetricSelected(d.id))).classed("faded", false)
    d3.selectAll(".metricDots").filter(d => (isMetricSelected(d.id))).classed("faded", false);

    if (lineSelectedMetrics.length > 0) {
        d3.selectAll(".metricLine").filter(d => (!isMetricSelected(d.id))).classed("faded", true);
        d3.selectAll(".lineLegendSquare").filter(d => !isMetricSelected(d.id)).classed("faded", true)
        d3.selectAll(".metricDots").filter(d => (!isMetricSelected(d.id))).classed("faded", true);
    }
}

function parseDataForDots(d) {
    var output = [];

    for (e in d.data) {
        if (d.data[e] != -1) {
            point = d.data[e];
            point["id"] = d.id;
            point["color"] = d.color;
            output.push(point);
        }
    }

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

dispatcher.on("metricSelected.linechart", function(code) {
    if (currentMetric1 == currentMetric2 && lineChartMetrics.length >= 6) return;
    if (lineChartMetrics.length >= 7) return;
    var index = metricIndex(code);
    if (metricIndex(code) == -1){ 
        lineChartMetrics.push({"country": COUNTRY1, "id": code, "color": rentColor(), "data": parseMetricsForCountry(code, COUNTRY1)});    
    }
    drawLines(COUNTRY1, code);
    drawLineLegend();
});

dispatcher.on("metric1Selected.linechart", function(code) {

    if (metricIndex(code) == -1) {
        if (currentMetric1 != currentMetric2) {
            var currentIndex = metricIndex(currentMetric1);
            returnColor(lineChartMetrics[currentIndex].color)
            lineChartMetrics.splice(currentIndex, 1);
        }

        lineChartMetrics.push({"country": COUNTRY1, "id": code, "color": rentColor(), "data": parseMetricsForCountry(code, COUNTRY1)});    
    }
     else if (code == currentMetric2) {
        var currentIndex = metricIndex(currentMetric1);
        returnColor(lineChartMetrics[currentIndex].color)
        lineChartMetrics.splice(currentIndex, 1);
    }
    
    currentMetric1 = code;
    drawLines(COUNTRY1, code);
    drawLineLegend();
});

dispatcher.on("metric2Selected.linechart", function(code) {
    if (metricIndex(code) == -1) {
        if (currentMetric1 != currentMetric2) {
            var currentIndex = metricIndex(currentMetric2);
            returnColor(lineChartMetrics[currentIndex].color)
            lineChartMetrics.splice(currentIndex, 1);
        }

        lineChartMetrics.push({"country": COUNTRY1, "id": code, "color": rentColor(), "data": parseMetricsForCountry(code, COUNTRY1)});    
    }
    else if (code == currentMetric1) {
        var currentIndex = metricIndex(currentMetric2);
        returnColor(lineChartMetrics[currentIndex].color)
        lineChartMetrics.splice(currentIndex, 1);
    }
    currentMetric2 = code;
    drawLines(COUNTRY1, code);
    drawLineLegend();
});

dispatcher.on("metricUnselected.linechart", function(code) {
    if (code == METRIC1 || code == METRIC2) return;

    var index = metricIndex(code);

    if (index == -1) return;

    returnColor(lineChartMetrics[index].color)
    lineChartMetrics.splice(index, 1);

    if (isMetricSelected(code)) {
        var index = lineSelectedMetrics.indexOf(code);
        lineSelectedMetrics.splice(index, 1);
        if (lineSelectedMetrics.length <= 0) {
            d3.selectAll(".metricLine").classed("faded", false);
            d3.selectAll(".lineLegendSquare").classed("faded", false)
            d3.selectAll(".metricDots").classed("faded", false);
        }
    }

    drawLines(COUNTRY1, code);
    drawLineLegend();
});

dispatcher.on("country1Selected.linechart", function(code) {
    var currentMetrics = [];

    for (i in lineChartMetrics) {
        currentMetrics.push(lineChartMetrics[i].id);
    }

    for (m in currentMetrics) {
        var index = metricIndex(currentMetrics[m]);
        var color = (lineChartMetrics[index].color)
        lineChartMetrics.splice(index, 1);
        lineChartMetrics.push({"country": COUNTRY1, "id": currentMetrics[m], "color": color, "data": parseMetricsForCountry(currentMetrics[m], COUNTRY1)});
    }

    updateLines();
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
    d3.selectAll(".metricLine").filter(d => (d.id == c.id || isMetricSelected(d.id))).classed("faded", false).classed("highlightedLine", true);
    d3.selectAll(".lineLegendSquare").filter(d => (d.id == c.id || isMetricSelected(d.id))).classed("faded", false).classed("highlightedLine", true);
    d3.selectAll(".metricDots").filter(d => (d.id == c.id || isMetricSelected(d.id))).classed("faded", false).classed("highlightedLine", true);

    d3.selectAll(".metricLine").filter(d => (d.id != c.id && !isMetricSelected(d.id))).classed("faded", true).classed("highlightedLine", false);
    d3.selectAll(".lineLegendSquare").filter(d => (d.id != c.id && !isMetricSelected(d.id))).classed("faded", true).classed("highlightedLine", false);
    d3.selectAll(".metricDots").filter(d => (d.id != c.id && !isMetricSelected(d.id))).classed("faded", true).classed("highlightedLine", false);
}

function legendHoverOff(c) {
    if (lineSelectedMetrics.length == 0) {
        d3.selectAll(".metricLine").classed("faded", false).classed("highlightedLine", false);
        d3.selectAll(".metricDots").classed("faded", false).classed("highlightedLine", false);
        d3.selectAll(".lineLegendSquare").classed("faded", false).classed("highlightedLine", false);
    } else {
        d3.selectAll(".metricLine").filter(d => isMetricSelected(d.id)).classed("faded", false).classed("highlightedLine", true);;
        d3.selectAll(".metricDots").filter(d => isMetricSelected(d.id)).classed("faded", false).classed("highlightedLine", true);;
        d3.selectAll(".lineLegendSquare").filter(d => isMetricSelected(d.id)).classed("faded", false).classed("highlightedLine", true);;

        d3.selectAll(".metricLine").filter(d => !isMetricSelected(d.id)).classed("faded", true).classed("highlightedLine", false);;
        d3.selectAll(".metricDots").filter(d => !isMetricSelected(d.id)).classed("faded", true).classed("highlightedLine", false);
        d3.selectAll(".lineLegendSquare").filter(d => !isMetricSelected(d.id)).classed("faded", true).classed("highlightedLine", false);;
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

    var identification = dataset[c.country].name;
    var metric = c.id;

    lineChartTooltip.html(
            "<h3>" + identification + "</h3>" + 
            "<h4>" + METRICS[c.id].name + "</h4>");
    
    lineChartTooltip.transition().duration(300).style("opacity", "0.9");
    lineChartTooltip.style("left", (d3.event.pageX) + "px");	
    lineChartTooltip.style("top", (d3.event.pageY - 28) + "px");
    lineChartTooltip.style("display", "");	
}


function lineHoverOff(c) {
    legendHoverOff(c);
    lineChartTooltip.transition().duration(400).style("opacity", "0").transition()
        .style("display", "none");

}

function lineClick(c) {legendClick(c)}

function dotHoverOn(c) {
    d3.selectAll(".metricDot").filter(d => d.id == c.id && d.year == c.year)
            .transition().duration(200)
            .attr("r", 8);

    legendHoverOn(c)

    var metric = c.id;
    if (metric == "INTERNET" || metric == "UNEMPLOYMENT") {
        lineChartTooltip.html(
            "<h3>" + dataset[COUNTRY1].name + "</h3>" + 
            "<h4>" + METRICS[metric].name + "</h4>"+ 
            "<p>Year: " + c.year + "</p>" +
            "<p>Value: " + c.truValue.toFixed(2) + "%</p>" +
            "<p>Normalized Value: " + c.value.toFixed(2) + "</p>");
    } 
    else if(metric == "GDPPC") {
        lineChartTooltip.html(
                "<h3>" + dataset[COUNTRY1].name + "</h3>" + 
                "<h4>" + METRICS[metric].name + "</h4>" + 
                "<p>Year: " + c.year + "</p>" +
                "<p>Value: " + c.truValuet.toFixed(2) + " $/capita" + "</p>" +
                "<p>Normalized Value: " + c.value.toFixed(2) + "</p>");
    } 
    else {
        lineChartTooltip.html(
                "<h3>" + dataset[COUNTRY1].name + "</h3>" + 
                "<h4>" + METRICS[metric].name + "</h4>" + 
                "<p>Year: " + c.year + "</p>" +
                "<p>Value: " + c.value.toFixed(2) + "</p>");    
    }
    
    lineChartTooltip.transition().duration(300).style("opacity", "0.9");
    lineChartTooltip.style("left", (d3.event.pageX + 10) + "px")		
    lineChartTooltip.style("top", (d3.event.pageY + 10) + "px");	
}
function dotHoverOff(c) {
    legendHoverOff(c);
    d3.selectAll(".metricDot").transition().duration(200).attr("r", 5);
    lineChartTooltip.transition().duration(400).style("opacity", "0").transition()
        .style("top", -200+"px")
        .style("left", -200+"px");
}
function dotClick(c) {legendClick(c)}

function isMetricSelected(metric) {
    return lineSelectedMetrics.indexOf(metric) == -1 ? false : true;
}
