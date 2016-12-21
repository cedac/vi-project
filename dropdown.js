var c1 = document.getElementById("country1")
var c2 = document.getElementById("country2")
var m1 = document.getElementById("metric1")
var m2 = document.getElementById("metric2")

function initCountryDropdowns(d) {
    var dropdown_countries = []
    var dropdown_continents = []
    for (c in d) {
        if ("Continent" in d[c]) {
            dropdown_countries.push({code: c, name: d[c].name})
        } else {
            if (c == "World") {
                continue
            }
            dropdown_continents.push({code: c, name: d[c].name})
        }
    }
    dropdown_countries.sort((a,b) => a.name.localeCompare(b.name))
    dropdown_continents.sort((a,b) => a.name.localeCompare(b.name))
    var element = new Option(" -- Continents --")
    element.disabled = true;
    c1.appendChild(element)
    var element = new Option(" -- Continents --")
    element.disabled = true;
    c2.appendChild(element)
    for (c in dropdown_continents) {
        var continent = dropdown_continents[c]
        c1.appendChild(new Option(continent.name, continent.name))
        c2.appendChild(new Option(continent.name, continent.name))
    }

    var element = new Option(" -- Countries --")
    element.disabled = true;
    c1.appendChild(element)
    var element = new Option(" -- Countries --")
    element.disabled = true;
    c2.appendChild(element)
    for (c in dropdown_countries) {
        var country = dropdown_countries[c]
        c1.appendChild(new Option(country.name, country.code))
        c2.appendChild(new Option(country.name, country.code))
    }

    c1.value = COUNTRY1
    c2.value = COUNTRY2
}

(function(){
    var dropdown_metrics = []
    for (m in METRICS) {
        if ("name" in METRICS[m]) {
            dropdown_metrics.push(METRICS[m])
        }
    }
    dropdown_metrics.sort((a,b) => a.name.localeCompare(b.name))
    for (m in dropdown_metrics) {
        var metric = dropdown_metrics[m]
        m1.appendChild(new Option(metric.name, metric.code))
        m2.appendChild(new Option(metric.name, metric.code))
    }

    m1.value = METRIC1
    m2.value = METRIC2

    m1.onchange = e => {
        METRIC1 = m1[m1.selectedIndex].value
        dispatcher.call("metric1Selected", m1, METRIC1)
    }

    m2.onchange = e => {
        METRIC2 = m2[m2.selectedIndex].value
        dispatcher.call("metric2Selected", m2, METRIC2)
    }
})()

dispatcher.on('country1Selected.dropdown', c => c1.value = c)
dispatcher.on('country2Selected.dropdown', c => c2.value = c)