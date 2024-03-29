const COUNTRY_2_OFFSET = 115
var UNIQUE_ID = 0

dispatcher.on('metricEnter.heatmap', function(d) {
    heatmapSVG.selectAll(".country1, .country2")
        .style('opacity', 1)
        .filter(e => e.metric_code !== d && selected_metrics.indexOf(e.metric_code) == -1)
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
    updateHeatmapMetricAxisColor()
})

dispatcher.on('metricUnselected.heatmap', function(d) {
    updateHeatmapMetricAxisColor()
})

dispatcher.on('metricEnter.cdot', function(d) {
    heatmapSVG.selectAll(".dot1, .dot2, .linediff")
        .attr('r', 5)
        .style('opacity', 1)
        .filter(e => e.code !== d && selected_metrics.indexOf(e.code) == -1)
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
    updateHeatmapMetricAxisOrder()
    drawHeatmapLegend(d[country], d[COUNTRY2])
    drawDotplot(d[country], d[COUNTRY2])
})

dispatcher.on('country2Selected.heatmap', country => {
    drawCountry(d[country], 2)
    drawHeatmapLegend(d[COUNTRY1], d[country])
    drawDotplot(d[COUNTRY1], d[country])
})

dispatcher.on('yearSelected.cdot', () => {
    sortMetrics(d[COUNTRY1])
    drawCountry(d[COUNTRY1], 1)
    drawCountry(d[COUNTRY2], 2)
    updateHeatmapMetricAxisOrder()
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

var hm_margin = {
        top: 20,
        right: 0,
        bottom: 100,
        left: 150
    },
    hm_width = 700 - hm_margin.left - hm_margin.right,
    hm_height = 400 - hm_margin.top - hm_margin.bottom,
    gridSize = 13
    legendElementWidth = gridSize * 2,
    buckets = 8,
    //years = ["08", "09", "10", "11", "12", "13", "14"];
    years = ["2008", "", "", "", "", "", "2014"];
    //years = ["'08", "", "", "", "", "", "'14"];

var heatmapSVG = d3.select(HEATMAP_DIV_SELECTOR).append("svg")
    .attr("width", hm_width + hm_margin.left + hm_margin.right)
    .attr("height", hm_height + hm_margin.top + hm_margin.bottom)
    .append("g")
    .attr("transform", "translate(" + hm_margin.left + "," + hm_margin.top + ")");

var yearsLabel = heatmapSVG.selectAll(".timeLabel")
    .data(years)
    .enter()

yearsLabel
    .append("text")
    .text(function(d) { return d; })
    .attr("x", function(d, i) { return i * gridSize; })
    .attr("y", 3)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + gridSize / 2 + ", -6)")
    .attr("class", "timeLabel mono axis")

yearsLabel
    .append("text")
    .text(function(d) { return d; })
    .attr("x", function(d, i) { return i * gridSize + COUNTRY_2_OFFSET; })
    .attr("y", 3)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + gridSize / 2 + ", -6)")
    .attr("class", "timeLabel mono axis");


var colorScale = d3.scaleQuantile()
    .domain([1, 5])
    .range(COLORS);

var scale_metric_heatmap = d => scale_metric(d, d => d.value, d => d.metric_code)
var colorScale_scaleValue = d => {
    var value = scale_metric_heatmap(d)
    return VALID_RANGE(value) ? colorScale(value) : NOVALUE_COLOR
}

function drawCountry(country, n) {
    var heatmapData = parseHeatmapData(country);

    var squares = heatmapSVG.selectAll(".country" + n)
        .data(heatmapData, d => d.metric_code + ":" + d.year);

    squares.enter().append("rect")
        .attr("x", function(d) { return ((n == 2) ? COUNTRY_2_OFFSET : 0) + (d.year) * gridSize; })
        .attr("y", function(d) { return (d.metric) * gridSize; })
        .attr("rx", 1)
        .attr("ry", 1)
        .attr("class", "bordered country" + n)
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", colorScale_scaleValue)
        .on("mouseover", function(d) { dispatcher.call("metricEnter", this, d.metric_code) })
        .on("mouseout", function(d) { dispatcher.call("metricLeave", this, d.metric_code) })
        .on('click', d => heatmap_cdot_onClick(d.metric_code))
        .on('contextmenu', d3.contextMenu(heatMapMenu))
    
    squares
        .transition().duration(1000)
        .style("fill", colorScale_scaleValue)
        .transition().duration(1000)
        .attr("y", function(d) { return (d.metric) * gridSize; })

    squares.exit().remove();
}

function drawHeatmapLegend(c1, c2) {
    var countryNames = heatmapSVG.selectAll('.country-name')
        .data([c1, c2], d => d.code)
        
    countryNames
        .enter()
        .append('foreignObject')
        .attr('x', (d, i) => COUNTRY_2_OFFSET * i)
        .attr('y', 27 * gridSize + 3)
        .attr('width', gridSize * 7)
        .attr('height', gridSize * 7)
        .attr('class', 'country-name mono')
        .append('xhtml:p')
        .attr('class', 'mono')
        .text(d => d.name)
        .style('color', (d,i) => i == 0 ? COUNTRY1_COLOR : COUNTRY2_COLOR)

    countryNames
        .select('p')
        .text(d => d.name)
        .style('color', (d,i) => distinct_color(i))

    countryNames
        .exit()
        .remove()
}

function updateHeatmapMetricAxisOrder() {
    heatmapSVG.selectAll(".metricLabel")
        .data(METRICS_ARRAY, d => d.code)
        .transition().delay(1000).duration(1000)
        .attr("y", function(d, i) { return 1 + d.sort * gridSize; })
}

function updateHeatmapMetricAxisColor() {
    heatmapSVG.selectAll(".metricLabel")
        .data(METRICS_ARRAY, d => d.code)
        .transition().duration(200)
        .style('fill', TEXT_COLOR)
        .filter(d => selected_metrics.indexOf(d.code) > -1)
        .style('fill', '#aa7700')
}

function drawHeatmap(dataset, dataset2) {
    var metricLabels = heatmapSVG.selectAll(".metricLabel")
        .data(METRICS_ARRAY.filter(m => m.sort != -1))
        .enter().append("text")
        .text(function(d) { return d.name; })
        .attr("x", 0)
        .attr("y", function(d, i) { return 1 + d.sort * gridSize; })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
        .attr("class", "metricLabel mono axis")
        .on("mouseover", function(d) { dispatcher.call("metricEnter", this, d.code) })
        .on("mouseout", function(d) { dispatcher.call("metricLeave", this, d.code) })
        .on('contextmenu', d3.contextMenu(heatMapMenu))
    
    drawCountry(dataset, 1)
    drawCountry(dataset2, 2)
    drawHeatmapLegend(dataset, dataset2)

    drawDotplot(dataset, dataset2)
}

function unselect_metrics() {
    selected_metrics = []
    heatmapSVG.selectAll(".country1, .country2").style('opacity', 1)
    updateHeatmapMetricAxisColor()
    heatmapSVG.selectAll(".dot1, .dot2, .linediff").style('opacity', 1)
    heatmapSVG.selectAll(".dot1, .dot2").attr('r', 5)
}

function heatmap_cdot_onClick(code) {
    var index = selected_metrics.indexOf(code) 
    if (index > -1) {
        selected_metrics.splice(index, 1)
    } else {
        selected_metrics.push(code)
    }
    updateHeatmapMetricAxisColor()
}