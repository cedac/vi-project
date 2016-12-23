
function scale_metric(d, v, c) {
    v = v ? v : (v => v.value)
    c = c ? c : (c => c.metric)
    return METRICS[c(d)].scale == undefined ? v(d) : METRICS[c(d)].scale(v(d));
}

function sortMetrics(country) {
    if (SORT_LOCK) {
        return
    }
    var values = [];
    for (metric in country) {
        if (typeof country[metric] === 'object') {
            if (METRICS[metric].five !== true && METRICS[metric].scale == undefined) {
                continue;
            }
            var scaled_value = scale_metric(country[metric][YEAR], d => d, d => metric)
            var sort_value = VALID_RANGE(scaled_value) ? scaled_value : 9e99
            values.push({
                v: sort_value,
                m: metric
            })
        }
    }
    values.sort(function(a,b) {
        return (a.v > b.v) ? 1 : (b.v > a.v) ? -1 : 0
    })
    
    for (var i = 0; i < values.length; i++) {
        METRICS[values[i].m].sort = i
    }
}

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

function changeYear(v) {
    showValue(v)
    YEAR = '' + v
    dispatcher.call('yearSelected', this, v)
}

function playYears(start, end) {
    var timeout = 3000
    document.getElementById("play").disabled = true
    if (start > end) {
        document.getElementById("play").disabled = false
        return
    }
    YEAR = start + ''
    document.getElementById("rangeinput").value = start
    document.getElementById("range").textContent = start
    dispatcher.call('yearSelected', this, start + '')

    setTimeout(() => playYears(start + 1, end), timeout)
}