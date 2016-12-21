
var sp_margin = {top: 20, right: 20, bottom: 40, left: 60}
var sp_width = 460 - margin.left - margin.right
var sp_height = 450 - margin.top - margin.bottom

var sp_xValue = d => d.x_5
var sp_xScale = d3.scaleLinear().range([0, sp_width]).domain([5,1])
var sp_xMap = d => sp_xScale(sp_xValue(d))
var sp_xAxis = d3.axisBottom().scale(sp_xScale)

var sp_yValue = d => d.y_5
var sp_yScale = d3.scaleLinear().range([sp_height, 0]).domain([5,1])
var sp_yMap = d => sp_yScale(sp_yValue(d))
var sp_yAxis = d3.axisLeft().scale(sp_yScale)

const sp_colorScale = d => COLOR_SCALE((d.x_5 + d.y_5) / 2)

var sp_svg = d3.select(".scatterplot")
    .append("svg")
        .attr("width", sp_width + sp_margin.left + sp_margin.right)
        .attr("height", sp_height + sp_margin.top + sp_margin.bottom)
    .append("g")
        .attr("transform", "translate(" + sp_margin.left + "," + sp_margin.top + ")");

var sp_tooltip = d3.select("body")
    .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

function chooseColor(c) {
    return sp_colorScale(c)
    switch (d[c].Continent) {
        case 'Europe':
            return 'rgba(20,30,200,0.8)'
        case 'America':
            return 'rgba(200,30,20,0.8)'
        case 'Africa':
            return 'rgba(120,120,20,0.8)'
        case 'Asia':
            return 'rgba(20,120,120,0.8)'
        case 'Oceania':
            return 'rgba(120,30,120,0.8)'
        default:
            return 'rgba(255,255,255,0.8)'
    }
}

function parseScatterplotData(mx, my) {
    data = []
    for (c in d) {
        if (d[c].Continent == undefined) {
            continue
        }
        var obj = {
            x: d[c][mx][YEAR],
            x_5: METRICS[mx].scale ? METRICS[mx].scale(d[c][mx][YEAR]) : d[c][mx][YEAR],
            y: d[c][my][YEAR],
            y_5: METRICS[my].scale ? METRICS[my].scale(d[c][my][YEAR]) : d[c][my][YEAR],
            color: 'white',
            id: c
        }
        obj.color = chooseColor(obj)
        data.push(obj)
    }
    return data
}

function drawScatterplot(mx, my) {
    sp_svg.append('line')
        .attr('y1', sp_yScale(3))
        .attr('y2', sp_yScale(3))
        .attr('x1', sp_xScale(1))
        .attr('x2', sp_xScale(5))
        .style('stroke', SCATTERPLOT_QUADRANT_COLOR)

    sp_svg.append('line')
        .attr('y1', sp_yScale(1))
        .attr('y2', sp_yScale(5))
        .attr('x1', sp_xScale(3))
        .attr('x2', sp_xScale(3))
        .style('stroke', SCATTERPLOT_QUADRANT_COLOR)

    sp_svg.append("g")
      .attr("class", "x axis sp-x-axis")
      .attr("transform", "translate(0," + sp_height + ")")
      .call(sp_xAxis)
    .append("text")
      .attr("class", "label sp-x-label")
      .attr("x", sp_width/2)
      .attr("y", 32)
      .style("text-anchor", "middle")
      .text(METRICS[mx].name);

    sp_svg.append("g")
      .attr("class", "y axis sp-y-axis")
      .call(sp_yAxis)
    .append("text")
      .attr("class", "label sp-y-label")
      .attr("transform", "translate(-40, "+sp_height/2+") rotate(-90)")
      //.attr("y", sp_height/2)
      //.attr("x", -32)
      .attr("dy", ".71em")
      .style("text-anchor", "middle")
      .text(METRICS[my].name);

      updateScatterplot(mx, my)
}

function updateScatterplot(mx, my) {
    data = parseScatterplotData(mx, my)

    sp_svg.selectAll(".dot")
        .data(data, d => d.id)
        .enter()
        .filter(d => VALID_RANGE(d.x_5) && VALID_RANGE(d.y_5))
        .append("circle")
        .attr("class", "dot")
        .attr("r", 4)
        .attr("cx", sp_xMap)
        .attr("cy", sp_yMap)
        .style("fill", d => d.color)
        .style('opacity', '0.85')
        .style('stroke-width', '2px')

    sp_svg.selectAll(".dot")
        .data(data, d => d.id)
        .transition()
        .duration(1000)
        .attr('cx', sp_xMap)
        .attr('cy', sp_yMap)
        .style('fill', sp_colorScale)

    sp_svg.select('.sp-x-label').text(METRICS[mx].name)
    sp_svg.select('.sp-y-label').text(METRICS[my].name)
}

function sp_highlightSelectedCountries() {
    sp_svg.selectAll(".dot")
        .data(data, d => d.id)
        .transition()
        .duration(500)
        .style('stroke', 'none')

    sp_svg.selectAll(".dot")
        .data(data, d => d.id)
        .filter(d => d.id == COUNTRY1)
        .transition()
        .duration(500)
        .style('stroke', 'rgba(255,22,22,0.8)')
        .each((x,y,z) => { z[0].parentNode.appendChild(z[0])});

    sp_svg.selectAll(".dot")
        .data(data, d => d.id)
        .filter(d => d.id == COUNTRY2)
        .transition()
        .duration(500)
        .style('stroke', 'rgba(22,22,200,0.8)')
        .each((x,y,z) => { z[0].parentNode.appendChild(z[0])});
}

dispatcher.on('metric1Selected.scatterplot', m => {
    updateScatterplot(m, METRIC2)
})

dispatcher.on('metric2Selected.scatterplot', m => {
    updateScatterplot(METRIC1, m)
})

dispatcher.on('yearSelected.scatterplot', y => {
    updateScatterplot(METRIC1, METRIC2)
})

dispatcher.on('country1Selected', c => {
    sp_highlightSelectedCountries()
})

dispatcher.on('country2Selected', c => {
    sp_highlightSelectedCountries()
})