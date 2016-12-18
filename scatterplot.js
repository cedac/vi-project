
var sp_margin = {top: 20, right: 20, bottom: 30, left: 40}
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
    return 'rgba(255,255,255,0.5)'
    switch (c.Continent) {
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
        data.push({
            x: d[c][mx][YEAR],
            x_5: METRICS[mx].scale ? METRICS[mx].scale(d[c][mx][YEAR]) : d[c][mx][YEAR],
            y: d[c][my][YEAR],
            y_5: METRICS[my].scale ? METRICS[my].scale(d[c][my][YEAR]) : d[c][my][YEAR],
            color: chooseColor(d[c]),
            id: c
        })
    }
    return data
}

function drawScatterplot(mx, my) {
    data = parseScatterplotData(mx, my)

    sp_svg.selectAll(".dot")
        .data(data, d => d.id)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 2)
        .attr("cx", sp_xMap)
        .attr("cy", sp_yMap)
        .style("fill", d => d.color)

    sp_svg.append("g")
      .attr("class", "x axis sp-x-axis")
      .attr("transform", "translate(0," + sp_height + ")")
      .call(sp_xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", sp_width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text(METRICS[mx].name);

    sp_svg.append("g")
      .attr("class", "y axis sp-x-axis")
      .call(sp_yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(METRICS[my].name);
}

function updateScatterplotMetric(data, cxy, xyMap) {
    sp_svg.selectAll(".dot")
        .data(data, d => d.id)
        .transition()
        .duration(1000)
        .attr(cxy, xyMap)
}

function updateScatterplotX(mx, my) {
    data = parseScatterplotData(mx, my)
    updateScatterplotMetric(data, 'cx', sp_xMap)
}

function updateScatterplotY(mx, my) {
    data = parseScatterplotData(mx, my)
    updateScatterplotMetric(data, 'cy', sp_yMap)
}