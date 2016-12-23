var d = undefined

const DEBUG = window.location.hash == "#debug"

const TEXT_COLOR = '#aaa'

const FADE_OPACITY = 0.15
const WIDTH = 0
const HEIGHT = 0
const HEATMAP_DIV_SELECTOR = "#div3"

const DOTPLOT_SIZE = 70
const DOTPLOT_X_PADDING = 240

const SCATTERPLOT_QUADRANT_COLOR = 'rgba(180,180,180,0.05)'

const VALID_RANGE = v => v >= 1 && v <= 5

const NOVALUE_COLOR = '#777'
const COUNTRY1_COLOR = '#7fc97f'
const COUNTRY2_COLOR = '#beaed4'

var YEAR = "2008"
var COUNTRY1 = "PRT"
var COUNTRY2 = "ISL"
var METRIC1 = "OVERALL"
var METRIC2 = "HOMICIDES"

var SORT_LOCK = false

var selected_metrics = []

const COLORS = ['#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac'].reverse()
const DISTINCT_COLOR = ['#b2df8a', '#a6cee3']

const COLOR_SCALE = d3.scaleQuantile().domain([1, 5]).range(COLORS);

var distinct_color = i => DISTINCT_COLOR[i]

var dispatcher = d3.dispatch(
    "valueEnter", "metricEnter", "metricLeave", "yearEnter", 
    "countryEnter", "country1Selected", "country2Selected", 
    "metricSelected", "metricUnselected", "yearSelected",
    "metric1Selected", "metric2Selected")

if (DEBUG) {
    const events = Object.keys(dispatcher._)
    for (i in events) {
        const event = events[i]
        dispatcher.on(events[i] + ".logger", (that, args) => {
            console.log('[Event Logger] ' + event + ' fired. ', that, args)
        })
    }
}