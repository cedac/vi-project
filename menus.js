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
            console.log("my things")
            console.log(elm);
            console.log(d);
            console.log(i);
            COUNTRY2 = d.id;
            dispatcher.call("country2Selected", this, COUNTRY2);
        }
    }
]

var heatMapMenu = [
    {
        title: 'Select as primary metric',
        action: function(elm, d, i) {
           METRIC1 = d.metric_code;
           dispatcher.call("metric1Selected", this, METRIC1);

           //add to selected in heatmap
        }
    },
    {
          title: 'Select as secondary metric',
          action: function(elm, d, i) {
            METRIC2 = d.metric_code;
            dispatcher.call("metric1Selected", this, METRIC2);

            //add to selected in heatmap
        }
    },
    {
          title: 'Select as other metric',
          action: function(elm, d, i) {
            dispatcher.call('metricSelected', this, d.metric_code)

            //add to selected in heatmap
        }
    }
    
]

