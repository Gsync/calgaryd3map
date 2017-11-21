function createMap(w, h) {
    d3.select("#map")
        .attr("width", w)
        .attr("height", h)
        .append("text")
        .attr("x", w / 2)
        .attr("y", "1em")
        .attr("font-size", "1.5em")
        .style("text-anchor", "middle")
        .classed("map-title", true);
}

function drawMap(geodata, data) {
    let map = d3.select('#map');

    var projection = d3.geoMercator()
        .fitExtent([[0, 0], [w, h]], geodata);

    let path = d3.geoPath().projection(projection);

    map
        .selectAll('.community')
        .data(geodata.features)
        .enter()
        .append('path')
        .attr('d', path)
        .classed('community', true)
        .attr('fill', 'steelblue');

}