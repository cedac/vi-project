const FADE_OPACITY = 0.15
const WIDTH = 0
const HEIGHT = 0
const HEATMAP_DIV_SELECTOR = "#div3"

const DOTPLOT_SIZE = 70
const DOTPLOT_X_PADDING = 240

var YEAR = "2008"
var COUNTRY1 = "PRT"
var COUNTRY2 = "ISL"

var SORT_LOCK = false

var selected_metrics = []

COLORS = ['#b2182b','#d6604d','#f4a582','#fddbc7','#d1e5f0','#92c5de','#4393c3','#2166ac'].reverse()
//COLORS = ['#b2182b','#d6604d','#f4a582','#fddbc7','#f7f7f7','#d1e5f0','#92c5de','#4393c3','#2166ac'].reverse()
//colors = ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'].reverse(),
//colors = ['#d73027','#f46d43','#fdae61','#fee090','#ffffbf','#e0f3f8','#abd9e9','#74add1','#4575b4'].reverse(),
//colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]

DISTINCT_COLOR = ['#b2df8a', '#a6cee3']
var distinct_color = i => DISTINCT_COLOR[i]

var dispatcher = d3.dispatch("valueEnter", "metricEnter", "metricLeave", "yearEnter", "countryEnter", "country1Selected", "country2Selected", "metricSelected", "yearSelected")