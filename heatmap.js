const COUNTRY_2_OFFSET = 115
var UNIQUE_ID = 0

var dispatcher = d3.dispatch("valueEnter", "metricEnter", "metricLeave", "yearEnter", "countryEnter")

dispatcher.on('metricEnter.heatmap', function(d) {
    heatmapSVG.selectAll(".country1, .country2")
        .filter(e => e.metric !== d.metric)
        .style('opacity', FADE_OPACITY)
})

dispatcher.on('metricLeave.heatmap', function(d) {
    heatmapSVG.selectAll(".country1, .country2")
        .style('opacity', 1)
})

dispatcher.on('metricEnter.cdot', function(d) {
    heatmapSVG.selectAll(".dot1, .dot2, .linediff")
        .filter(e => e.code !== d.metric_code)
        .style('opacity', FADE_OPACITY)
})

dispatcher.on('metricLeave.cdot', function(d) {
    heatmapSVG.selectAll(".dot1, .dot2, .linediff")
        .style('opacity', 1)
})

function parseHeatmapData(country, year) {
    var data = []; 
    for (metric in country) {
        if (typeof country[metric] === 'object') {
            if (METRICS[metric].five !== true) {
                continue;
            }
            for (year in country[metric]) {
                data.push({
                    year: parseInt(year) - 2008,
                    metric: METRICS[metric].sort,
                    metric_code: metric,
                    value: +country[metric][year]
                })
            }
        }
    }
    return data;
}

var margin = {
        top: 20,
        right: 0,
        bottom: 100,
        left: 150
    },
    width = 730 - margin.left - margin.right,
    height = 430 - margin.top - margin.bottom,
    gridSize = Math.floor(13), // CHANGED
    legendElementWidth = gridSize * 2,
    buckets = 8,
    years = ["08", "09", "10", "11", "12", "13", "14"];
    //years = ["2008", "", "", "", "", "", "2014"];

var heatmapSVG = d3.select(HEATMAP_DIV_SELECTOR).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var yearLabels = heatmapSVG.selectAll(".timeLabel")
    .data(years)
    .enter().append("text")
    .text(function(d) { return d; })
    .attr("x", function(d, i) { return i * gridSize; })
    .attr("y", 0)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + gridSize / 2 + ", -6)")
    .attr("class", "timeLabel mono axis");

var colorScale = d3.scaleQuantile()
    .domain([1, 5])
    .range(COLORS);



function drawCountry(country, n) {
    var heatmapData = parseHeatmapData(country);

    var squares = heatmapSVG.selectAll(".country" + n)
        .data(heatmapData, d => d.metric_code + ":" + d.year);

    squares.enter().append("rect")
        .attr("x", function(d) { return ((n == 2) ? COUNTRY_2_OFFSET : 0) + (d.year) * gridSize; })
        .attr("y", function(d) { return (d.metric) * height / 25; })
        .attr("rx", 1)
        .attr("ry", 1)
        .attr("class", "bordered country" + n)
        .attr("width", gridSize)
        .attr("height", gridSize)
        .attr("debug", d => d.metric + ":" + d.value)
        .on("mouseover", function(d) { dispatcher.call("metricEnter", this, d) })
        .on("mouseout", function(d) { dispatcher.call("metricLeave", this, d) })
        .style("fill", function(d) { return colorScale(d.value); })
    
    squares
        .transition().duration(1000)
        .attr("y", function(d) { return (d.metric) * height / 25; })
        .transition().duration(1000)
        .style("fill", function(d) { return colorScale(d.value); })

    squares.exit().remove();
}

function drawHeatmapMetricAxis() {
    var axis = heatmapSVG.selectAll(".dayLabel")
        .data(METRICS_ARRAY, d => d.code);

    axis.enter()
        .append("text")
        .filter(function(d) { return d.sort != -1 })
        .text(function(d) { return d.code; })
        .attr("x", 0)
        .attr("y", function(d, i) { return 1 + d.sort * height / 25; })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
        .attr("class", "dayLabel mono axis");

    axis
        .filter(function(d) { return d.sort != -1 })
        .transition().duration(1000)
        .attr("y", function(d, i) { return 1 + d.sort * height / 25; })
}

function heatmapDraw(dataset, dataset2) {
    var metricLabels = heatmapSVG.selectAll(".dayLabel")
        .data(METRICS_ARRAY)
        .enter().append("text")
        .filter(function(d) { return d.sort != -1 })
        .text(function(d) { return d.code; })
        .attr("x", 0)
        .attr("y", function(d, i) { return 1 + d.sort * height / 25; })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
        .attr("class", "dayLabel mono axis");

    drawCountry(dataset, 1)
    drawCountry(dataset2, 2)

    drawDotplot(dataset, dataset2)
}