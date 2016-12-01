
var dataset;
var world;
var mapMetric = "OVERALL";
const MAP_DIV_SELECTOR = "#DIV2";


var colors = ['#b2182b','#d6604d','#f4a582','#fddbc7','#d1e5f0','#92c5de','#4393c3','#2166ac'].reverse();

var mapSVG;
var mapIdiomSVG;
var projection;
var path;

var countriesWithData;

var hoveredCountry = undefined;

var tooltip = d3.select("body")
        .append("div")
        .classed("map-tooltip", true)
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

d3.json("dataset.json", function (data) {
    dataset = data;
    mapMetric = "OVERALL";

    countriesWithData = Object.keys(dataset);
    genChoroplethMap();
})

function genChoroplethMap() {

    var margin = {top: 20, right: 90, bottom: 30, left: 50},
        width = 710 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    mapIdiomSVG = d3.select(MAP_DIV_SELECTOR).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .style("border", "1px solid #333")
                .call(d3.zoom()
                .scaleExtent([1 / 2, 4])
                .on("zoom", zoomed));
            
    mapSVG = mapIdiomSVG.append("g");

    d3.select("body")
    .on("keydown", onKeyDown)
    .on("keyup", onKeyUp);


    projection = d3.geoMercator().translate([width/2, height/2+100]);

    path = d3.geoPath().projection(projection);

    var graticule = d3.geoGraticule();

    d3.queue()
        .defer(d3.json, "world-x.json")
        .await(drawMap);
}

function drawMap(error, data) {
    world = data;
    var countries = topojson.feature(data, data.objects.countries).features;

    var asia = {type: "FeatureCollection", name: "Asia", id: "Asia", features: countries.filter(d => filterContinents(d, "Asia"))};
    var europe = {type: "FeatureCollection", name: "Europe", id: "Europe", features: countries.filter(d => filterContinents(d, "Europe"))};
    var africa = {type: "FeatureCollection", name: "Africa", id: "Africa", features: countries.filter(d => filterContinents(d, "Africa"))};
    var america = {type: "FeatureCollection", name: "America", id: "America", features: countries.filter(d => filterContinents(d, "America"))};
    var oceania = {type: "FeatureCollection", name: "Oceania", id: "Oceania", features: countries.filter(d => filterContinents(d, "Oceania"))};

    var color = d3.scaleQuantile()
    .domain([1, 5])
    .range(colors);

    var allContinents = [asia, europe, africa, america, oceania];
    
    mapSVG.selectAll(".country")
            .data(countries)
            .enter().append("path")
            .attr("class", "country")
            .property("continent", getContinent)
            .attr("fill", heatColor)
            .attr("d", path)
            .on("mouseover", hoverOn)
            .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
            .on("mouseout", hoverOff)
            .on("click", click);
    
    mapSVG.selectAll(".country").filter( d => d.id == COUNTRY1).classed("selected1", true);
    mapSVG.selectAll(".country").filter( d => d.id == COUNTRY2).classed("selected2", true);    


}

function filterContinents(country, continent) {
    return dataset[country.id] ? dataset[country.id].Continent == continent : false
}

function isSelected(c) {
    console.log("c.id: " + c.id + " | sel: " + COUNTRY1);
    if (c.id == COUNTRY1) {
        return "#FF0000";
    } else {
        return "";
    }
}

function zoomed() {
  mapSVG.attr("transform", d3.event.transform);
}

function onKeyDown() {
    if (d3.event.altKey) {
        //d3.selectAll(".continent").style("visibility", "visible");
        d3.selectAll(".country").filter(function(d) {return d.id != COUNTRY1 && d.id !== COUNTRY2;}).attr("fill", heatColorContinent);
        if (hoveredCountry) {
            hoverOn(hoveredCountry, true);
        }
    }
}

function onKeyUp() {
    if (d3.event.altKey) {
        return
    }

    d3.selectAll(".country").attr("fill", heatColor);

    if (COUNTRY1 && COUNTRY1.length > 3) {
        d3.selectAll(".country")
        .filter( d => getContinent(d) == COUNTRY1)
        .filter( d => d != COUNTRY1)
        .attr("fill", heatColorContinent)
    }

    if (COUNTRY2 && COUNTRY2.length > 3) {
        d3.selectAll(".country")
        .filter( d => getContinent(d) == COUNTRY2)
        .filter( d => d != COUNTRY2)
        .attr("fill", heatColorContinent)
    }

    if (hoveredCountry) {
            hoverOn(hoveredCountry);
    }

    if ( ! isContinent(COUNTRY1)) {
        d3.selectAll(".country").filter( d => d.id == COUNTRY1).attr("fill", heatColor);
    }

    if ( ! isContinent(COUNTRY2)) {
        d3.selectAll(".country").filter( d => d.id == COUNTRY2).attr("fill", heatColor);
    }
}


function click(c) {
    d3.select(this).classed("selected1", false);
    d3.select(this).classed("selected2", false);

    if(d3.event.shiftKey == true) {
        if (COUNTRY2 != undefined) {
            d3.selectAll(".country")
                .classed("selected2", false)
                .style("opacity", "0.6");
            
            d3.selectAll(".country")
                .filter(d => getContinent(d) == COUNTRY2)
                .filter(d => getContinent(d) != COUNTRY1)
                .attr("fill", heatColor);
        }

        if (d3.event.altKey) {
            COUNTRY2 = getContinent(c);
            d3.selectAll(".country").filter(d => getContinent(d) == getContinent(c))
                .filter(d => d.id != COUNTRY1)
                .classed("selected2", true)
                .style("opacity", 1);
        } else {
            COUNTRY2 = c.id;
            d3.select(this).classed("selected2", true)
            .style("opacity", 1)
            .attr("fill", heatColor);

            d3.selectAll(".country").filter(d => getContinent(d) == COUNTRY1).classed("selected1", true);
        }
        dispatcher.call("country2Selected", this, COUNTRY2);
    } else {
        if (COUNTRY1 != undefined) {
            d3.selectAll(".country")
                .classed("selected1", false)
                .style("opacity", "0.6");

            d3.selectAll(".country")
                .filter(d => getContinent(d) == COUNTRY1)
                .filter(d => getContinent(d) != COUNTRY2)
                .attr("fill", heatColor)
        }

        if (d3.event.altKey) {
            COUNTRY1 = getContinent(c);
            d3.selectAll(".country").filter(d => getContinent(d) == getContinent(c))
                .filter(d => d.id != COUNTRY2)
                .classed("selected1", true)
                .attr("fill", heatColorContinent)
                .style("opacity", 1);
        } else {
            COUNTRY1 = c.id;
            d3.select(this).classed("selected1", true)
            .style("opacity", 1)
            .attr("fill", heatColor);

            d3.selectAll(".country").filter(d => getContinent(d) == COUNTRY2).classed("selected2", true);
        }
        dispatcher.call("country1Selected", this, COUNTRY1);
    }
}

function hoverOn(c, forceContinent = false) {
    if (c.id == COUNTRY1 || c.id == COUNTRY2) return;
    if (countriesWithData.indexOf(c.id) == -1) {
        tooltip.style("visibility", "hidden");
        return;
    }

    hoveredCountry = c;

    if (forceContinent === true) {
        d3.selectAll(".country").filter(d => getContinent(d) == getContinent(c)).style("opacity", 1);
    }

    if (d3.event.altKey) {
        d3.selectAll(".country")
        .filter(d => (d.id !== c.id && d.id !== COUNTRY1 && d.id !== COUNTRY2))
        .filter(d => (getContinent(d) != getContinent(c)))
        .style("opacity", 0.6);

        tooltip.html("<p>" + getContinent(c) + "</p><p>" + dataset[getContinent(c)][mapMetric]["" + YEAR] + "</p>");
        tooltip.style("visibility", "visible");
        
    } else {
        d3.selectAll(".country")
        .filter(d => (d.id !== c.id && d.id !== COUNTRY1 && d.id !== COUNTRY2))
        .style("opacity", 0.6);


        tooltip.html("<p>" + dataset[c.id].name + "</p><p>" + dataset[c.id].OVERALL["" + YEAR] + "</p>");
        tooltip.style("visibility", "visible");
    }

}

function hoverOff(c) {

    hoveredCountry = undefined;
    d3.selectAll(".country").style("opacity", 1);
    d3.select(this).classed("hovered", false);
    tooltip.style("visibility", "hidden");

}

dispatcher.on("metricSelected", function(e) {
    mapMetric = e.metric_code;

    mapSVG.selectAll(".country").attr("fill", heatColor);

    if (isContinent(COUNTRY1)) {
        mapSVG.selectAll(".country")
        .filter( d => getContinent(d) == COUNTRY1)
        .filter( d => !(d.id == COUNTRY2))
        .attr("fill", heatColorContinent);
    }

    if (isContinent(COUNTRY2)) {
        mapSVG.selectAll(".country")
        .filter( d => getContinent(d) == COUNTRY2)
        .filter( d => !(d.id == COUNTRY1))
        .attr("fill", heatColorContinent);
    }
});

dispatcher.on("yearSelected", function(e) {
    mapSVG.selectAll(".country").attr("fill", heatColor);

    if (isContinent(COUNTRY1)) {
        mapSVG.selectAll(".country")
        .filter( d => getContinent(d) == COUNTRY1)
        .filter( d => !(d.id == COUNTRY2))
        .attr("fill", heatColorContinent);
    }

    if (isContinent(COUNTRY2)) {
        mapSVG.selectAll(".country")
        .filter( d => getContinent(d) == COUNTRY2)
        .filter( d => !(d.id == COUNTRY1))
        .attr("fill", heatColorContinent);
    }
});

function heatColor(c) {
    var color = d3.scaleQuantile()
                .domain([1, 5])
                .range(colors);

    var code = c.id;

    if (dataset[code] == undefined) return "#ccc";

    var value = dataset[code][mapMetric]["" + YEAR];

    value = METRICS[mapMetric].scale ? METRICS[mapMetric].scale(value) : value;

    return color(+value);
}

function heatColorContinent(c) {
    var color = d3.scaleQuantile()
                .domain([1, 5])
                .range(colors);

    var code = c.id;

    if (dataset[code] == undefined) return "#ccc";

    var cContinent = dataset[code].Continent;

    var value = dataset[cContinent][mapMetric]["" + YEAR];

    return color(+value);
}

function getContinent(c) {
    var code = c.id;

    if (dataset[code] == undefined) return "";

    return dataset[code].Continent;
}

function isContinent(c) {
    return c.length > 3;
}