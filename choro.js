
var dataset;
var world;
var mapMetric = "OVERALL";
const MAP_DIV_SELECTOR = "#DIV2";

var mapSVG;
var mapIdiomSVG;
var projection;
var path;

var countriesWithData;

var hoveredCountry = undefined;
var altPressed = false;

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
        width = 680 - margin.left - margin.right,
        height = 340 - margin.top - margin.bottom;

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


    projection = d3.geoMercator().translate([width/2+65, height/2+70]).scale(110);

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
    .range(COLORS);

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
        altPressed = true;
        updateMap();
        if (hoveredCountry) {
            hoverOn(hoveredCountry, true);
        }
    }
}

function onKeyUp() {
    if (d3.event.altKey) {
        return
    }

    altPressed = false;
    updateMap();

    if (hoveredCountry) {
            hoverOn(hoveredCountry);
    }  
}
function click(c) {
    
    if (!d3.event.shiftKey && !d3.event.altKey) {
        COUNTRY1 = c.id;
        dispatcher.call("country1Selected", this, COUNTRY1);
    }
    else if (!d3.event.shiftKey && d3.event.altKey) {
        COUNTRY1 = getContinent(c);
        dispatcher.call("country1Selected", this, COUNTRY1);
    }
    else if (d3.event.shiftKey && !d3.event.altKey) {
        COUNTRY2 = c.id;
        dispatcher.call("country2Selected", this, COUNTRY2);
    }
    else if (d3.event.shiftKey && d3.event.altKey) {
        COUNTRY2 = getContinent(c);
        dispatcher.call("country2Selected", this, COUNTRY2);
    }
    console.log("c1: " + COUNTRY1 + " | c2: " + COUNTRY2);
    updateMap();
}

function hoverOn(c, forceContinent = false) {


    if (c.id == COUNTRY1 || c.id == COUNTRY2) {
        if (d3.event.altKey) {
            tooltip.html("<p>" + getContinent(c) + "</p><p>" + dataset[getContinent(c)][mapMetric]["" + YEAR] + "</p>");
            tooltip.style("visibility", "visible");
        } else {
            tooltip.html("<p>" + dataset[c.id].name + "</p><p>" + dataset[c.id][mapMetric]["" + YEAR] + "</p>");
            tooltip.style("visibility", "visible");
        }
        return;
    }
    if (countriesWithData.indexOf(c.id) == -1) {
        tooltip.style("visibility", "hidden");
        return;
    }

    hoveredCountry = c;

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


        tooltip.html("<p>" + dataset[c.id].name + "</p><p>" + dataset[c.id][mapMetric]["" + YEAR] + "</p>");
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
    updateMap();
});

dispatcher.on("yearSelected", function(e) {
    updateMap();
});

function heatColor(c) {
    var color = d3.scaleQuantile()
                .domain([1, 5])
                .range(COLORS);

    if (isContinent(COUNTRY1) && getContinent(c) == COUNTRY1) {
        return heatColorContinent(c, color)
    }

    if (isContinent(COUNTRY2) && getContinent(c) == COUNTRY2) {
        return heatColorContinent(c, color)
    }

    if (altPressed && c.id != COUNTRY1 && c.id != COUNTRY2) {
        return heatColorContinent(c, color)
    }

    var code = c.id;

    if (dataset[code] == undefined) return "#333";

    var value = dataset[code][mapMetric]["" + YEAR];

    value = METRICS[mapMetric].scale ? METRICS[mapMetric].scale(value) : value;

    return color(+value);
}

function heatColorContinent(c, color) {
    var code = c.id;

    if (dataset[code] == undefined) return "#333";

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

function updateMap() {
    allCountries = mapSVG.selectAll(".country");

    //treat colors
    allCountries.transition().duration(700).attr("fill", heatColor);

    //treat selections
    if (COUNTRY1 || COUNTRY2) {
        if (isContinent(COUNTRY1)) {
            allCountries.filter(d => (getContinent(d) == COUNTRY1) && (d.id != COUNTRY2)).classed("selected1", true).classed("selected2", false);
            allCountries.filter(d => getContinent(d) != COUNTRY1).classed("selected1", false);            
        } else {
            console.log("classing " + COUNTRY1);
            
            allCountries.filter(d => d.id == COUNTRY1).classed("selected1", true).classed("selected2", false);
            allCountries.filter(d => d.id != COUNTRY1).classed("selected1", false);
        }

        if (isContinent(COUNTRY2)) {
            allCountries.filter(d => (getContinent(d) == COUNTRY2) && (d.id != COUNTRY1)).classed("selected2", true).classed("selected1", false);
            allCountries.filter(d => getContinent(d) != COUNTRY2).classed("selected2", false);            
        } else {
            allCountries.filter(d => d.id == COUNTRY2).classed("selected2", true).classed("selected1", false);
            allCountries.filter(d => d.id != COUNTRY2).classed("selected2", false);
        }
    }

}