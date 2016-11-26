const FADE_OPACITY = 0.15
const WIDTH = 0
const HEIGHT = 0
const HEATMAP_DIV_SELECTOR = "#div3"

const DOTPLOT_SIZE = 70
const DOTPLOT_X_PADDING = 250
const YEAR = "2008"

function parseHeatmapData(country) {
    var data = []; 
    var i = 0;
    for (metric in country) {
        if (typeof country[metric] === 'object') {
            if (country[metric]["2008"] > 5) {
                    continue;
                }
            for (year in country[metric]) {
                METRICS[metric].sort = i;
                data.push({
                    year: parseInt(year) - 2008,
                    metric: METRICS[metric].sort,
                    metric_code: metric,
                    value: +country[metric][year]
                })
            }
            i++
        }
    }
    return data;
}

function parseDotplotData(c1, c2) {
    var data = []
    for (metric in c1) {
        if (METRICS[metric].sort != -1) {
            data.push({
                v1: c1[metric][YEAR],
                v2: c2[metric][YEAR],
                color: (c1[metric][YEAR] < c2[metric][YEAR]) ? "green" : "red",
                sort: METRICS[metric].sort,
                code: METRICS[metric].code
            })
        }
    }
    return data
}

function drawDotplot(c1, c2) {
    var cdotdata = parseDotplotData(c1, c2)

    heatmapSVG.selectAll('.firstLine')
        .data(cdotdata)
        .enter()
        .append('line')
        .attr('y1', function(d) { return d.sort * height / 25 + gridSize/2 })
        .attr('y2', function(d) { return d.sort * height / 25 + gridSize/2 })
        .attr('x1', function(d) { return DOTPLOT_X_PADDING})
        .attr('x2', function(d) { return DOTPLOT_X_PADDING + Math.max(d.v1, d.v2) * DOTPLOT_SIZE })
        .style('stroke', '#eee')

    heatmapSVG.selectAll('.dot1')
        .data(cdotdata)
        .enter()
        .append('circle')
        .attr('cx', function(d) {return DOTPLOT_X_PADDING + d.v1 * DOTPLOT_SIZE })
        .attr('cy', function(d) {return d.sort * height / 25 + gridSize/2})
        .attr('r', function(d) {return 5})
        .style('stroke', '#111')
        .style('fill', 'rgb(244, 165, 130)')

    heatmapSVG.selectAll('.dot2')
        .data(cdotdata)
        .enter()
        .append('circle')
        .attr('cx', function(d) {return DOTPLOT_X_PADDING + d.v2 * DOTPLOT_SIZE })
        .attr('cy', function(d) {return d.sort * height / 25 + gridSize/2})
        .attr('r', function(d) {return 5})
        .style('stroke', '#111')
        .style('fill', 'rgb(67, 147, 195)')

}

function fade(opacity, d) {
    d3.selectAll("rect")
        .filter(function(e) { return e.metric !== d.metric; })
        .style("opacity", opacity);
}

var margin = {
        top: 50,
        right: 0,
        bottom: 100,
        left: 150
    },
    width = 935 - margin.left - margin.right,
    height = 540 - margin.top - margin.bottom,
    gridSize = Math.floor(width / (24 * 2 + 1)), // CHANGED
    legendElementWidth = gridSize * 2,
    buckets = 10,
    //colors = ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'].reverse(),
    colors = ['#67001f','#b2182b','#d6604d','#f4a582','#fddbc7','#d1e5f0','#92c5de','#4393c3','#2166ac','#053061'].reverse(),
    //colors = ['#d73027','#f46d43','#fdae61','#fee090','#ffffbf','#e0f3f8','#abd9e9','#74add1','#4575b4'].reverse(),
    //colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
    metrics = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
    years = ["08", "09", "10", "11", "12", "13", "14"];

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
    .domain([0, 5])
    .range(colors);

function heatmapDraw(dataset, dataset2) {
    var heatmapData = parseHeatmapData(dataset);
    var heatmapData2 = parseHeatmapData(dataset2);

    var metricLabels = heatmapSVG.selectAll(".dayLabel")
        .data(METRICS_ARRAY)
        .enter().append("text")
        .filter(function(d) { return d.sort != -1 })
        .text(function(d) { return d.code; })
        .attr("x", 0)
        .attr("y", function(d, i) { return 1 + i * height / 25; })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
        .attr("class", "dayLabel mono axis");

    var cards = heatmapSVG.selectAll(".country1")
        .data(heatmapData, function(d) { return d.year + ':' + d.metric; });

    var country2 = heatmapSVG.selectAll(".country2")
        .data(heatmapData2, function(d) { return d.year + ':' + d.metric; })
        .enter().append("rect")
        .attr("x", function(d) { return 120 + (d.year) * gridSize; })
        .attr("y", function(d) { return (d.metric) * height / 25; })
        .attr("rx", 1)
        .attr("ry", 1)
        .attr("class", "hour bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .on("mouseover", function(d) { fade(FADE_OPACITY, d) })
        .on("mouseout", function(d) { fade(1, d) })
        .style("fill", function(d) { return colorScale(d.value); });;


    cards.append("title");

    cards.enter().append("rect")
        .attr("x", function(d) { return (d.year) * gridSize; })
        .attr("y", function(d) { return (d.metric) * height / 25; })
        .attr("rx", 1)
        .attr("ry", 1)
        .attr("class", "hour bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .on("mouseover", function(d) { fade(FADE_OPACITY, d) })
        .on("mouseout", function(d) { fade(1, d) })
        .style("fill", function(d) { return colorScale(d.value); });

    cards.transition().duration(1000)
        .style("fill", function(d) { return colorScale(d.value); });

    cards.select("title").text(function(d) { return d.value; });

    cards.exit().remove();

    drawDotplot(dataset, dataset2)
}