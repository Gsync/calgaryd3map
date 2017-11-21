function createBar(w, h) {

    let bar = d3.select('#bar')
        .attr('width', w)
        .attr('height', h);
    //x-axis
    bar.append('g')
        .attr('transform', 'translate(0, ' + (h - p) + ')')
        .classed('x-axis', true)
    //.call(d3.axisBottom(xScale));

    //y-axis
    bar.append('g')
        .attr('transform', 'translate(' + (p) + ', 0)')
        .classed('y-axis', true)
    //.call(d3.axisLeft(yScale));

    //x-axis title
    bar.append('text')
        .attr('x', w / 2)
        .attr('y', h - 10)
        .style('text-anchor', 'middle')
        .text('Year')
        .classed("bar-title", true);

    //y-axis title
    bar.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -h / 2)
        .attr('y', 10)
        .style('text-anchor', 'middle')
        .text('Frequency');
}
function drawBar(data, community) {

    let bPadding = 1;
    let leftPadding = 59;
    let minYear = d3.min(data, d => d.year);
    let maxYear = d3.max(data, d => d.year);
    let communityData;

    if (community === "") {
        communityData = data;
    } else {
        communityData = data.filter(d => d.community === community);
    }

    let xScale = d3.scaleLinear()
        .domain(d3.extent(communityData, d => d.year))
        .rangeRound([p, w - p]);

    let histogram = d3.histogram()
        .domain(xScale.domain())
        .thresholds(xScale.ticks())
        .value(d => d.year);

    let bins = histogram(communityData);

    //let barWidth = w/bins.length-bPadding;
    let barWidth = xScale(xScale.domain()[0] + 1) - xScale.range()[0];

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])//0 to largest bin height
        .range([h - p, p]);

    var xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format(".0f"));

    d3.select(".x-axis")
        .attr("transform", "translate(0, " + (h - p) + ")")
        .call(xAxis);


    var yAxis = d3.axisLeft(yScale);

    d3.select(".y-axis")
        .attr("transform", "translate(" + (leftPadding - barWidth / 2) + ",0)")
        .transition()
        .duration(1000)
        .call(yAxis);

    let bar = d3.select('#bar')
        .attr('width', w)
        .attr('height', h);

    bar.selectAll('rect')
        .data(bins)
        .enter()
        .append('rect')
        .attr('x', (d, i) => xScale(d.x0))
        .attr('y', d => yScale(d.length))
        .attr('width', d => xScale(d.x1) - xScale(d.x0) - bPadding)
        .attr('height', d => h - p - yScale(d.length))
        .attr('fill', 'steelblue');


    d3.select(".bar-title")
        .text(community + " Community");


    var t = d3.transition()
        .duration(1000)
        .ease(d3.easeBounceOut);

    let update = bar.selectAll('rect')
        .data(bins);

    update.exit()
        .transition(t)
        .delay((d, i, nodes) => (nodes.length - i - 1) * 100)
        .remove();

    update.enter().append('rect')
        .merge(update)
        .attr('x', (d, i) => xScale(d.x0))
        .transition(t)
        .delay((d, i) => i * 100)
        .attr('width', d => xScale(d.x1) - xScale(d.x0) - bPadding)
        .attr('y', d => yScale(d.length))
        .attr('height', d => h - p - yScale(d.length));
}