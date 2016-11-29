var d;

function parseLinechartData(country) {
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


var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960,
    height = 500,
    padding = 10;

var lineSvg = d3.select("#div4").append("svg")
    .attr("width", width - margin.right - margin.left)
    .attr("height", height - margin.top)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLinear().range([0, 760]),//lol wot
    y = d3.scaleLinear().range([420, 0]);//same
 //   z = d3.scaleOrdinal(d3.schemeCategory10);


d3.json('dataset.json', data => {
    d = data
    d3_xy_chart(d.Europe);
});

function d3_xy_chart(pais){
    var data = parseLinechartData(pais);

    var line = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.value); });

    x.domain([2008,2014]);

    y.domain([0,5]);

 //   z.domain(data.map(function(c) { return d.metric; }));

    var xaxis = lineSvg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + 420 + ")") //same2
        .call(d3.axisBottom(x)
            .ticks(7)
            .tickFormat(d3.format("d")))
        .append("text")
        .attr("transform", "translate(750,-5)") //same4
        .attr("fill", "#FFFFFF")
        .text("Anos");

    var yaxis = lineSvg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y)
            .ticks(6)
            .tickFormat(d3.format("d")))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("fill", "#FFFFFF")
        .text("Valor");

    var pontos = lineSvg.selectAll(".pontos")
        .data(data)
        .enter().append("g")
        .attr("class", "pontos");

    pontos.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d); });
      //  .style("stroke", function(d) { return z(d.metric); });

  /*  metric.append("text")
       // .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.year) + "," + y(d.value) + ")"; })
        .attr("x", 3)
        .attr("dy", "0.35em")
        .style("font", "10px sans-serif")
        .text(function(d) { return d.metric; });
    */
}