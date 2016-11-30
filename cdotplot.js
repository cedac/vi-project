function parseDotplotData(c1, c2) {
    var data = []
    for (metric in c1) {
        if (METRICS[metric].sort != -1) {
            data.push({
                v1: c1[metric][YEAR],
                v2: c2[metric][YEAR],
                color: (c1[metric][YEAR] > c2[metric][YEAR]) ? COLORS[1] : COLORS[COLORS.length - 2],
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
        .attr('y1', function(d) { return d.metric.sort * height / 25 + gridSize/2 })
        .attr('y2', function(d) { return d.metric.sort * height / 25 + gridSize/2 })
        .attr('x1', function(d) { return DOTPLOT_X_PADDING})
        .attr('x2', function(d) { return DOTPLOT_X_PADDING + 5 * DOTPLOT_SIZE })
        .attr('class', 'line-background')
        .style('stroke', '#333')
        .style('stroke-width', '0.5px')


    var lineDiffSelection = heatmapSVG.selectAll('.linediff')
        .data(cdotdata, d => d.code);

    lineDiffSelection
        .enter()
        .append('line')
        .attr('y1', function(d) { return d.metric.sort * height / 25 + gridSize/2 })
        .attr('y2', function(d) { return d.metric.sort * height / 25 + gridSize/2 })
        .attr('x1', function(d) { return DOTPLOT_X_PADDING + Math.min(d.v1, d.v2) * DOTPLOT_SIZE})
        .attr('x2', function(d) { return DOTPLOT_X_PADDING + Math.max(d.v1, d.v2) * DOTPLOT_SIZE })
        .attr('class', 'linediff')
        .style('stroke', function(d) {return d.color})

    lineDiffSelection
        .transition().duration(1000)
        .attr('x1', function(d) { return DOTPLOT_X_PADDING + Math.min(d.v1, d.v2) * DOTPLOT_SIZE})
        .attr('x2', function(d) { return DOTPLOT_X_PADDING + Math.max(d.v1, d.v2) * DOTPLOT_SIZE })
        .transition().duration(1000)        
        .attr('y1', function(d) { return d.metric.sort * height / 25 + gridSize/2 })
        .attr('y2', function(d) { return d.metric.sort * height / 25 + gridSize/2 })

    lineDiffSelection
        .exit()
        .remove()

    var dot1Selection = heatmapSVG.selectAll('.dot1')
        .data(cdotdata, d => d.code);
    
    dot1Selection
        .enter()
        .append('circle')
        .attr('cx', function(d) {return DOTPLOT_X_PADDING + d.v1 * DOTPLOT_SIZE })
        .attr('cy', function(d) {return d.metric.sort * height / 25 + gridSize/2})
        .attr('r', function(d) {return 5})
        .attr('class', 'dot1')
        .style('stroke', '#111')
        .style('fill', '#b2df8a')

    dot1Selection
        .transition().duration(1000)
        .attr('cx', function(d) {return DOTPLOT_X_PADDING + d.v1 * DOTPLOT_SIZE })
        .transition().duration(1000)        
        .attr('cy', function(d) {return d.metric.sort * height / 25 + gridSize/2})

    dot1Selection
        .exit()
        .remove()

    dot2Selection = heatmapSVG.selectAll('.dot2')
        .data(cdotdata, d => d.code)

    dot2Selection
        .enter()
        .append('circle')
        .attr('cx', function(d) {return DOTPLOT_X_PADDING + d.v2 * DOTPLOT_SIZE })
        .attr('cy', function(d) {return d.metric.sort * height / 25 + gridSize/2})
        .attr('r', function(d) {return 5})
        .attr('class', 'dot2')
        .style('stroke', '#111')
        .style('fill', '#a6cee3')

    dot2Selection
        .transition().duration(1000)
        .attr('cx', function(d) {return DOTPLOT_X_PADDING + d.v2 * DOTPLOT_SIZE })
        .transition().duration(1000)        
        .attr('cy', function(d) {return d.metric.sort * height / 25 + gridSize/2})

    dot2Selection
        .exit()
        .remove()
}
