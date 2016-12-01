const COUNTRY_2_OFFSET = 115
var UNIQUE_ID = 0

dispatcher.on('metricEnter.heatmap', function(d) {
    heatmapSVG.selectAll(".country1, .country2")
        .style('opacity', 1)
        .filter(e => e.metric !== d.metric && selected_metrics.indexOf(e.metric_code) == -1)
        .style('opacity', FADE_OPACITY)
})

dispatcher.on('metricLeave.heatmap', function(d) {
    if (selected_metrics.length > 0) {
        heatmapSVG.selectAll(".country1, .country2")
            .style('opacity', 1)
            .filter(e => selected_metrics.indexOf(e.metric_code) == -1)
            .style('opacity', FADE_OPACITY)
    } else {
        heatmapSVG.selectAll(".country1, .country2")
            .style('opacity', 1)
    }
})

dispatcher.on('metricSelected.heatmap', function(d) {
    drawHeatmapMetricAxis()
})

dispatcher.on('metricEnter.cdot', function(d) {
    heatmapSVG.selectAll(".dot1, .dot2, .linediff")
        .attr('r', 5)
        .style('opacity', 1)
        .filter(e => e.code !== d.metric_code && selected_metrics.indexOf(e.code) == -1)
        .attr('r', 3)
        .style('opacity', FADE_OPACITY)
})

dispatcher.on('metricLeave.cdot', function(d) {
    if (selected_metrics.length > 0) {
        heatmapSVG.selectAll(".dot1, .dot2, .linediff")
            .attr('r', 5)
            .style('opacity', 1)
            .filter(e => selected_metrics.indexOf(e.code) == -1)
            .attr('r', 3)
            .style('opacity', FADE_OPACITY)
    } else {
        heatmapSVG.selectAll(".dot1, .dot2, .linediff")
            .style('opacity', 1)

        heatmapSVG.selectAll(".dot1, .dot2")
            .attr('r', 5)
    }
})

dispatcher.on('country1Selected.heatmap', country => {
    sortMetrics(d[country])
    drawCountry(d[country], 1)
    drawCountry(d[COUNTRY2], 2)
    drawHeatmapMetricAxis()
    drawHeatmapLegend(d[country], d[COUNTRY2])
    drawDotplot(d[country], d[COUNTRY2])
})

dispatcher.on('country2Selected.heatmap', country => {
    drawCountry(d[country], 2)
    drawHeatmapLegend(d[COUNTRY1], d[country])
    drawDotplot(d[COUNTRY1], d[country])
})

dispatcher.on('yearSelected.cdot', () => {
    console.log("handling year")
    sortMetrics(d[COUNTRY1])
    drawCountry(d[COUNTRY1], 1)
    drawCountry(d[COUNTRY2], 2)
    drawHeatmapMetricAxis()
    drawDotplot(d[COUNTRY1], d[COUNTRY2])
})


function parseHeatmapData(country, year) {
    var data = []; 
    for (metric in country) {
        if (typeof country[metric] === 'object') {
            if (METRICS[metric].five !== true && METRICS[metric].scale == undefined) {
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
    years = ["2008", "", "", "", "", "", "2014"];
    //years = ["'08", "", "", "", "", "", "'14"];

var heatmapSVG = d3.select(HEATMAP_DIV_SELECTOR).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var yearsLabel = heatmapSVG.selectAll(".timeLabel")
    .data(years)
    .enter()

yearsLabel
    .append("text")
    .text(function(d) { return d; })
    .attr("x", function(d, i) { return i * gridSize; })
    .attr("y", 0)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + gridSize / 2 + ", -6)")
    .attr("class", "timeLabel mono axis")

yearsLabel
    .append("text")
    .text(function(d) { return d; })
    .attr("x", function(d, i) { return i * gridSize + COUNTRY_2_OFFSET; })
    .attr("y", 0)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + gridSize / 2 + ", -6)")
    .attr("class", "timeLabel mono axis");


var colorScale = d3.scaleQuantile()
    .domain([1, 5])
    .range(COLORS);

var scale_metric_heatmap = d => scale_metric(d, d => d.value, d => d.metric_code)
var colorScale_scaleValue = d => colorScale(scale_metric_heatmap(d))

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
        .attr("debug", d => d.metric_code + ":" + scale_metric_heatmap(d))
        .on("mouseover", function(d) { dispatcher.call("metricEnter", this, d) })
        .on("mouseout", function(d) { dispatcher.call("metricLeave", this, d) })
        .on('click', d => {
            var code = d.metric_code
            var index = selected_metrics.indexOf(code) 
            if (index > -1) {
                selected_metrics.splice(index, 1)
                dispatcher.call('metricSelected', this, d)
            } else {
                selected_metrics.push(code)
                dispatcher.call('metricSelected', this, d)
            }
        })
        .style("fill", colorScale_scaleValue)
    
    squares
        .attr("debug", d => d.metric_code + ":" + scale_metric_heatmap(d))
        .transition().duration(1000)
        .style("fill", colorScale_scaleValue)
        .transition().duration(1000)
        .attr("y", function(d) { return (d.metric) * height / 25; })

    squares.exit().remove();
}

function drawHeatmapLegend(c1, c2) {
    var countryNames = heatmapSVG.selectAll('.country-name')
        .data([c1, c2], d => d.code)
        
    countryNames
        .enter()
        .append('foreignObject')
        .attr('x', (d, i) => COUNTRY_2_OFFSET * i)
        .attr('y', 26 * gridSize)
        .attr('width', gridSize * 7)
        .attr('height', gridSize * 7)
        .attr('class', 'country-name mono')
        .append('xhtml:p')
        .attr('class', 'mono')
        .text(d => d.name)
        .style('color', (d,i) => distinct_color(i))

    countryNames
        .select('p')
        .text(d => d.name)
        .style('color', (d,i) => distinct_color(i))
        
    countryNames
        .exit()
        .remove()
}

function drawHeatmapMetricAxis() {
    var axis = heatmapSVG.selectAll(".dayLabel")
        .data(METRICS_ARRAY, d => d.code)
        .filter(function(d) { return d.sort != -1 });

    axis.enter()
        .append("text")
        .text(function(d) { return d.code; })
        .attr("x", 0)
        .attr("y", function(d, i) { return 1 + d.sort * height / 25; })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
        .attr("class", "dayLabel mono axis")

    axis
        .style('fill', '')
        .filter(d => selected_metrics.indexOf(d.code) > -1)
        .style('fill', '#aa7700')

    axis
        .transition().delay(1000).duration(1000)
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
    drawHeatmapLegend(dataset, dataset2)

    drawDotplot(dataset, dataset2)
}