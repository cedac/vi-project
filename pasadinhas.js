var d;
var xpto;

d3.json('dataset.json', data => {
    d = data
    if (window.location.search.substring(1).length > 0) {
        vis(parse(eval("d." + window.location.search.substring(1))))
    }
});

var parseTime = d3.timeParse("%Y");

function parse(x) {
    var data = []; 
    for (key in x) {
        data.push({
            date: parseTime(key), 
            close: +x[key]
        })
    }
    return data;
}

function vis(data) {
    var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleTime()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var line = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.close); });

    x.domain(d3.extent(data, function(d) { return d.date; }));
    if (d3.extent(data, function(d) { return d.close; })[1] > 5) {
        y.domain([0.95 * d3.extent(data, function(d) { return d.close; })[0], 1.05 * d3.extent(data, function(d) { return d.close; })[1]]);
    } else {
        y.domain([0, 5]);
    }

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .style("text-anchor", "end")
        .text("Price ($)");

    g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    return 2;
}