
var dataset;
var world;
var mapMetric = "OVERALL";
const MAP_DIV_SELECTOR = "#DIV2";

var mapSVG;
var mapIdiomSVG;
var maplabelSVG;
var projection;
var path;

var altDown = false;

var countriesWithData;

var hoveredCountry = undefined;
var continentView = false;

var margin = {top: 20, right: 90, bottom: 30, left: 50},
    width = 680 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;

var tooltip = d3.select("body")
        .append("div")
        .classed("map-tooltip", true)
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

function bootstrap_map(data) {
    dataset = data;
    mapMetric = "OVERALL";

    countriesWithData = Object.keys(dataset);
    genChoroplethMap();
}

function genChoroplethMap() {

    mapIdiomSVG = d3.select(MAP_DIV_SELECTOR).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .style("border", "1px solid #333");
            
    mapSVG = mapIdiomSVG
                .call(d3.zoom()
                .scaleExtent([1 / 2, 4])
                .on("zoom", zoomed))
                .append("g");

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
            .on('contextmenu', d3.contextMenu(choroMenu, function() {
                    lockHover();}))
            .on("click", click);
    
    mapSVG.selectAll(".country").filter( d => d.id == COUNTRY1).classed("selected1", true);
    mapSVG.selectAll(".country").filter( d => d.id == COUNTRY2).classed("selected2", true);

    var labelText = METRICS[mapMetric].name + " | " + YEAR;

    mapIdiomSVG.selectAll(".metricMapLabelText")
            .data([mapMetric])
            .enter()
            .append("text")
            .attr("class", "metricMapLabelText monoBig")
            .style("text-anchor", "start")
            .attr("x", "4pt")
            .attr("y", "12pt")
            .text(d => labelText);
    
    var textWidth = getTextWidth(labelText, "12pt Consolas")

    mapIdiomSVG.insert("rect", "text")
            .attr("width", textWidth + 10)
            .attr("height", "16pt")
            .classed("map-label", true)
            .attr("fill" , "#333")
            .attr("opacity", "0.6");


}

function getTextWidth(text, font) {
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
};

function filterContinents(country, continent) {
    return dataset[country.id] ? dataset[country.id].Continent == continent : false
}

function isSelected(c) {
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
        altDown = true;
        continentView = continentView == true ? false : true;
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
    if (altDown && !d3.event.altKey) {
        altDown = false;
         altDown = false;
        continentView = continentView == true ? false : true;
        updateMap();

        if (hoveredCountry) {
                hoverOn(hoveredCountry);
        }  
    }

   
}
function click(c) {
    
    if (!d3.event.shiftKey && !continentView) {
        COUNTRY1 = c.id;
        dispatcher.call("country1Selected", this, COUNTRY1);
    }
    else if (!d3.event.shiftKey && continentView) {
        COUNTRY1 = getContinent(c);
        dispatcher.call("country1Selected", this, COUNTRY1);
    }
    else if (d3.event.shiftKey && !continentView) {
        COUNTRY2 = c.id;
        dispatcher.call("country2Selected", this, COUNTRY2);
    }
    else if (d3.event.shiftKey && continentView) {
        COUNTRY2 = getContinent(c);
        dispatcher.call("country2Selected", this, COUNTRY2);
    }
}

dispatcher.on("country1Selected.map", function(e) {
    updateMap();
});

dispatcher.on("country2Selected.map", function(e) {
    updateMap();
});

function lockHover() {
    hoverOn(c)
}


function hoverOn(c, forceContinent = false) {

    hoveredCountry = c.id;

    if (countriesWithData.indexOf(c.id) == -1) {
        tooltip.style("visibility", "hidden");
        return;
    }

    var isContinent;

    if (c.id == COUNTRY1 || c.id == COUNTRY2) {
        if (d3.event.altKey) {
            isContinent = true;
        } else {
            isContinent = false;
        }
    } else {
        hoveredCountry = c;

        if (continentView) {
            d3.selectAll(".country")
            .filter(d => (d.id !== c.id && d.id !== COUNTRY1 && d.id !== COUNTRY2))
            .filter(d => (getContinent(d) != getContinent(c)))
            .style("opacity", 0.6);

            isContinent = true;        
        } else {
            d3.selectAll(".country")
            .filter(d => (d.id !== c.id && d.id !== COUNTRY1 && d.id !== COUNTRY2))
            .style("opacity", 0.6);

            isContinent = false;
        }

    }

    var value;
    var identification;

    if (isContinent) {
        value = dataset[getContinent(c)][mapMetric]["" + YEAR].toFixed(2);
        identification = getContinent(c);
    } else {
        value = dataset[c.id][mapMetric]["" + YEAR].toFixed(2);
        identification = dataset[c.id].name;
    }

    value = (value == -1 ? "No information" : value);

    if (mapMetric == "INTERNET" || mapMetric == "UNEMPLOYMENT") {
        tooltip.html(
            "<h3>" + identification + "</h3>" + 
            "<h4>" + METRICS[mapMetric].name + "</h4>"+ 
            "<p>Value: " + value + "%</p>" +
            "<p>Normalized Value: " + METRICS[mapMetric].scale(value).toFixed(2) + "</p>");
    } 
    else if(mapMetric == "GDPPC") {
        tooltip.html(
                "<h3>" + identification + "</h3>" + 
                "<h4>" + METRICS[mapMetric].name + "</h4>" + 
                "<p>Value: " + value + (value == "No information" ? "" : " $/capita") + "</p>" +
                "<p>Normalized Value: " + (value == "No information" ? value : METRICS[mapMetric].scale(value).toFixed(2)) + "</p>");
    } 
    else {
        tooltip.html(
                "<h3>" + identification + "</h3>" + 
                "<h4>" + METRICS[mapMetric].name + "</h4>"+ 
                "<p>Value: " + value + " $/capita</p>");
    }
    
    tooltip.style("visibility", "visible");
}

function hoverOff(c) {

    hoveredCountry = undefined;
    d3.selectAll(".country").style("opacity", 1);
    d3.select(this).classed("hovered", false);
    tooltip.style("visibility", "hidden");

}

dispatcher.on("metric1Selected", function(e) {
    mapMetric = e;
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

    if (continentView && c.id != COUNTRY1 && c.id != COUNTRY2) {
        return heatColorContinent(c, color)
    }

    var code = c.id;

    if (dataset[code] == undefined) return "#333";

    var value = dataset[code][mapMetric]["" + YEAR];

    value = METRICS[mapMetric].scale ? METRICS[mapMetric].scale(value) : value;

    if (!VALID_RANGE(value)) {
        return NOVALUE_COLOR;
    }

    return color(+value);
}

function heatColorContinent(c, color) {
    var code = c.id;

    if (dataset[code] == undefined) return "#333";

    var cContinent = dataset[code].Continent;

    var value = dataset[cContinent][mapMetric]["" + YEAR];

    value = METRICS[mapMetric].scale ? METRICS[mapMetric].scale(value) : value;

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
    label = mapIdiomSVG.selectAll(".metricMapLabelText");
    labelBox = mapIdiomSVG.selectAll(".map-label");

    //treat label
    var labelText = METRICS[mapMetric].name + " | " + YEAR;
    label.text(function() { return labelText;});
    labelBox.attr("width", getTextWidth(labelText, "12pt Consolas") + 10);



    //treat colors
    allCountries.transition().duration(700).attr("fill", heatColor);

    //treat selections
    if (COUNTRY1 || COUNTRY2) {
        if (isContinent(COUNTRY1)) {
            allCountries.filter(d => (getContinent(d) == COUNTRY1) && (d.id != COUNTRY2)).classed("selected1", true).classed("selected2", false);
            allCountries.filter(d => getContinent(d) != COUNTRY1).classed("selected1", false);            
        } else {
            
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