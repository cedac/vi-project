
var dataset;
var world;
var metric;
const MAP_DIV_SELECTOR = "#DIV2";


var colors = ['#b2182b','#d6604d','#f4a582','#fddbc7','#d1e5f0','#92c5de','#4393c3','#2166ac'].reverse();

var country1;
var country2;
var year = 2014;


var mapSVG;
var mapIdiomSVG;
var projection;
var path;

var countriesWithData;

var tooltip = d3.select("body")
        .append("div")
        .classed("map-tooltip", true)
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

d3.json("dataset.json", function (data) {
    dataset = data;
    metric = "OVERALL";

    countriesWithData = Object.keys(dataset);
    genChoroplethMap();
})

function genChoroplethMap() {

    var margin = {top: 20, right: 90, bottom: 30, left: 50},
        width = 710 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;

    mapIdiomSVG = d3.select(MAP_DIV_SELECTOR).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .style("border", "1px solid #333")
                .call(d3.zoom()
                .scaleExtent([1 / 2, 4])
                .on("zoom", zoomed));
            
    mapSVG = mapIdiomSVG.append("g");


    projection = d3.geoMercator().translate([width/2, height/2+100]);

    path = d3.geoPath().projection(projection);

    var graticule = d3.geoGraticule();

    d3.queue()
        .defer(d3.json, "world-x.json")
        .await(drawMap);
}

function drawMap(error, data) {
    world = data;
    console.log(data);
    var countries = topojson.feature(data, data.objects.countries).features;
    console.log()

    var color = d3.scaleQuantile()
    .domain([1, 5])
    .range(colors);

    mapSVG.selectAll(".country")
            .data(countries)
            .enter().append("path")
            .attr("class", "country")
            .attr("fill", heatColor)
            .attr("d", path)
            .on("mouseover", hoverOn)
            .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
            .on("mouseout", hoverOff)
            .on("click", click);
}

function isSelected(c) {
    console.log("c.id: " + c.id + " | sel: " + country1);
    if (c.id == country1) {
        return "#FF0000";
    } else {
        return "";
    }
}

function zoomed() {
  mapSVG.attr("transform", d3.event.transform);
}

function click(c) {
    if(d3.event.shiftKey == true) {
        if (country2 != undefined) {
            d3.selectAll(".country")
                .filter(function(d){ return d.id == country2;})
                .classed("selected2", false);
        }

        country2 = c.id;
        d3.select(this).classed("selected2", true);
        dispatcher.call("country2Selected", this, country2);

    } else {
        if (country1 != undefined) {
            d3.selectAll(".country")
                .filter(function(d){ return d.id == country1;})
                .classed("selected1", false);
        }

        country1 = c.id;
        d3.select(this).classed("selected1", true);
        dispatcher.call("country1Selected", this, country1);
    }
}

function hoverOn(c) {
    if (c.id == country1 || c.id == country2) return;
    if (countriesWithData.indexOf(c.id) == -1) {
        tooltip.style("visibility", "hidden");
        return;
    }

    d3.selectAll(".country").filter(d => d.id !== c.id).style("opacity", 0.6);


    tooltip.html("<p>" + c.properties.name + "</p><p>" + dataset[c.id].OVERALL["" + year] + "</p>");
    tooltip.style("visibility", "visible");
}

function hoverOff(c) {

    d3.selectAll(".country").style("opacity", 1);
    d3.select(this).classed("hovered", false);
    tooltip.style("visibility", "hidden");

}

function heatColor(c) {
    var color = d3.scaleQuantile()
                .domain([1, 5])
                .range(colors);

    var code = c.id;

    if (dataset[code] == undefined) return "#ccc";

    var value = dataset[code].OVERALL["" + year];

    return color(+value);
}