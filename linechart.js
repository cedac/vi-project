var d;

function parseLinechartData(country) {
    var data = []; 
    for (metric in country) {
        if (typeof country[metric] === 'object') {
            if (METRICS[metric].five !== true) {                   
                continue;
            }
            for (year in country[metric]) {
                data.push({
                    year: parseInt(year),
                    metric_code: metric,
                    value: +country[metric][year]
                })
            }
        }
    }
    return data;    
}

var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 600,
    height = 300,
    padding = 10;

var lineSvg = d3.select("#div4").append("svg")
    .attr("width", width - margin.right - margin.left)
    .attr("height", height - margin.top)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleTime().range([0, 410]),//lol wot
    y = d3.scaleLinear().range([220, 0]);//same
    z = d3.scaleOrdinal(d3.schemeCategory20);

/* Comment for checkpoint layout display
d3.json('dataset.json', data => {
    d = data
    d3_xy_chart(d.Europe);
});
*/

function d3_xy_chart(pais){
    var lineData = parseLinechartData(pais);
    var aicredo = Object.values(lineData);
    var i=0;
    /*for(i; i<aicredo.length; i++){
        console.log(aicredo[i].year);
        console.log(aicredo[i].value);
    }*/

    var line = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.value); });

    x.domain([2008,2014]);

    y.domain([0,5]);

    z.domain(aicredo.map(function(c) { return d.metric_code; }));

    var xaxis = lineSvg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + 220 + ")")
        .call(d3.axisBottom(x)
            .ticks(7)
            .tickFormat(d3.format("d")))
        .append("text")
        .attr("transform", "translate(400,-5)") //same4
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
        .data(aicredo)
        .enter().append("pontos")
        .attr("class", "pontos");

    pontos.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d); });
        //.style("stroke", function(d) { return z(d.metric_code); });
/*
    pontos.append("text")
        .datum(function(d) { return {metric: d.metric_code, value: d.value[d.value.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.year) + "," + y(d.value) + ")"; })
        .attr("x", 3)
        .attr("dy", "0.35em")
        .style("font", "10px sans-serif")
        .text(function(d) { return d.metric_code; });*/
    
}