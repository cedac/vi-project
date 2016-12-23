var menuMapa = [
    {
        title: 'Select as primary country',
        action: function(elm, d, i) {
            COUNTRY1 = d.id;
            dispatcher.call("country1Selected", this, COUNTRY1);
        }
    },
    {
        title: 'Select as secondary country',
        action: function(elm, d, i) {
            COUNTRY2 = d.id;
            dispatcher.call("country2Selected", this, COUNTRY2);
        }
    }
]

var choroMenu = [
    {
        title: 'Select as primary',
        action: function(elm, d, i) {
            if (!continentView) {
                COUNTRY1 = d.id;
                dispatcher.call("country1Selected", this, COUNTRY1);
            }
            else if (continentView) {
                COUNTRY1 = getContinent(d);
                dispatcher.call("country1Selected", this, COUNTRY1);
            
            }
            
        }
    },
    {
        title: 'Select as secondary',
        action: function(elm, d, i) {
            if (!continentView) {
                COUNTRY2 = d.id;
                dispatcher.call("country2Selected", this, COUNTRY2);
            }
            else if (continentView) {
                COUNTRY2 = getContinent(d);
                dispatcher.call("country2Selected", this, COUNTRY2);
            
            }
        }
    },
    {
        title: 'Select continent as primary',
        action: function(elm, d, i) {
            COUNTRY1 = getContinent(d);
            dispatcher.call("country1Selected", this, COUNTRY1);
        }
    },
    {
        title: 'Select continent as secondary',
        action: function(elm, d, i) {
            COUNTRY1 = getContinent(2);
            dispatcher.call("country2Selected", this, COUNTRY2);
        }
    },
    {
        title: 'Toggle view per continent',
        action: function(elm, d, i) {
            continentView =  continentView == true ? false : true;
            updateMap();
            if (hoveredCountry) {
                hoverOn(hoveredCountry, true);
            }
        }
    }
]

var primaryOption = {
    title: 'Select as Primary metric',
    action: function(elm, d, i) {
        METRIC1 = d.metric_code;
        dispatcher.call("metric1Selected", this, METRIC1);
    }
}

var secondaryOption = {
    title: 'Select as Secondary metric',
    action: function(elm, d, i) {
        METRIC2 = d.metric_code;
        dispatcher.call("metric2Selected", this, METRIC2);
    }
}

const getDMetricCode = d => "metric_code" in d ? d.metric_code : d.code

const isAddMetric = d => {
    return lineChartMetrics.map(e => e.id).indexOf(getDMetricCode(d)) == -1
}

var linechartOption = {
    title: d => isAddMetric(d) ? "Add to linechart" : "Remove from linechart",
    action: function(elm, d, i) {
        if (isAddMetric(d)) {
            dispatcher.call('metricSelected', this, getDMetricCode(d))
        } else {
            dispatcher.call('metricUnselected', this, getDMetricCode(d))
        }
    }
}

var heatMapMenu = d => {
    if (d.metric_code == METRIC1 || d.metric_code == METRIC2 || (lineChartMetrics.length >= 7 && isAddMetric(d))) {
        return [primaryOption, secondaryOption]
    }
    return [primaryOption, secondaryOption, linechartOption]
}

var primaryLineChart = {
        title: 'Select as primary metric',
        action: function(elm, d, i) {
            METRIC1 = d.id;
            dispatcher.call("metric1Selected", this, d.id);
        }
    }

var secondaryLineChart = {
     title: 'Select as secondary metric',
        action: function(elm, d, i) {
            METRIC2 = d.id;
            dispatcher.call("metric2Selected", this, d.id);
        }
}

var removeLineChart = {
    title: 'Remove line',
        action: function(elm, d, i) {
            dispatcher.call("metricUnselected", this, d.id);
    }
}

var lineChartMenu = d => {
    if (d.id != METRIC1 && d.id != METRIC2) {
        return [primaryLineChart, secondaryLineChart, removeLineChart];
    } else {
        return [primaryLineChart, secondaryLineChart];
    }
}