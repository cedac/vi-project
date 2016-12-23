d3.json('dataset.json', data => {
    d = data

    sortMetrics(d[COUNTRY1])
    drawHeatmap(d[COUNTRY1], d[COUNTRY2])
    drawScatterplot(METRIC1, METRIC2)
    initCountryDropdowns(d)
    bootstrap_map(d)
    bootstrap_linechart(d)
});
