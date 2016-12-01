
var cdot_scale_value = (d, v) => scale_metric(d, v, d => d.code)
var cdot_scale_value1 = d => scale_metric(d, d => d.v1, d => d.code)
var cdot_scale_value2 = d => scale_metric(d, d => d.v2, d => d.code)

var cdot_x_scale = (d, v) => DOTPLOT_X_PADDING + (cdot_scale_value(d,v) - 1) * DOTPLOT_SIZE
var cdot_x1_scale = d => cdot_x_scale(d, d => d.v1)
var cdot_x2_scale = d => cdot_x_scale(d, d => d.v2)
var cdot_diff_scale = (d, f) => DOTPLOT_X_PADDING + (f(cdot_scale_value1(d), cdot_scale_value2(d)) - 1) * DOTPLOT_SIZE
var cdot_min_scale = d => cdot_diff_scale(d, Math.min)
var cdot_max_scale = d => cdot_diff_scale(d, Math.max)

var cdot_y_scale = d => d.metric.sort * height / 25 + gridSize/2

var cdot_linediff_color = d => d.better ? COLORS[1] : COLORS[COLORS.length - 2]

function parseDotplotData(c1, c2) {
    var data = []
    for (metric in c1) {
        if (METRICS[metric].sort != -1) {
            data.push({
                v1: c1[metric][YEAR],
                v2: c2[metric][YEAR],
                better: scale_metric(null, d => c1[metric][YEAR], d => metric) < scale_metric(null, d => c2[metric][YEAR], d => metric),
                color: (c1[metric][YEAR] < c2[metric][YEAR]) ? COLORS[COLORS.length - 2] : COLORS[1],
                color: (c1[metric][YEAR] < c2[metric][YEAR]) ? "blue" : "red",
                metric: METRICS[metric],
                sort: METRICS[metric].sort,
                code: METRICS[metric].code
            })
        }
    }
    return data
}

function drawDotplot(c1, c2) {
    var cdotdata = parseDotplotData(c1, c2)
    heatmapSVG.selectAll('.line-background')
        .data(cdotdata, d => d.code)
        .enter()
        .append('line')
        .attr('y1', cdot_y_scale)
        .attr('y2', cdot_y_scale)
        .attr('x1', function(d) { return DOTPLOT_X_PADDING})
        .attr('x2', function(d) { return DOTPLOT_X_PADDING + 4 * DOTPLOT_SIZE })
        .attr('class', 'line-background')
        .style('stroke', '#333')
        .style('stroke-width', '0.5px')

    var lineDiffSelection = heatmapSVG.selectAll('.linediff')
        .data(cdotdata, d => d.code + YEAR);

    lineDiffSelection
        .enter()
        .append('line')
        .attr('y1', cdot_y_scale)
        .attr('y2', cdot_y_scale)
        .attr('x1', cdot_min_scale)
        .attr('x2', cdot_max_scale)
        .attr('class', 'linediff')
        .style('stroke', cdot_linediff_color)

    lineDiffSelection
        .transition().duration(1000)
        .attr('x1', cdot_min_scale)
        .attr('x2', cdot_max_scale)
        .style('stroke', cdot_linediff_color)
        .transition().duration(1000)        
        .attr('y1', cdot_y_scale)
        .attr('y2', cdot_y_scale)

    lineDiffSelection
        .exit()
        .remove()

    var dot1Selection = heatmapSVG.selectAll('.dot1')
        .data(cdotdata, d => d.code);
    
    dot1Selection
        .enter()
        .append('circle')
        .attr('cx', cdot_x1_scale)
        .attr('cy', cdot_y_scale)
        .attr('r', 5)
        .attr('class', 'dot1')
        .style('stroke', '#111')
        .style('fill', '#b2df8a')

    dot1Selection
        .transition().duration(1000)
        .attr('cx', cdot_x1_scale)
        .transition().duration(1000)        
        .attr('cy', cdot_y_scale)

    dot1Selection
        .exit()
        .remove()

    dot2Selection = heatmapSVG.selectAll('.dot2')
        .data(cdotdata, d => d.code)

    dot2Selection
        .enter()
        .append('circle')
        .attr('cx', cdot_x2_scale)
        .attr('cy', cdot_y_scale)
        .attr('r', 5)
        .attr('class', 'dot2')
        .style('stroke', '#111')
        .style('fill', '#a6cee3')

    dot2Selection
        .transition().duration(1000)
        .attr('cx', cdot_x2_scale)
        .transition().duration(1000)        
        .attr('cy', cdot_y_scale)

    dot2Selection
        .exit()
        .remove()
}
