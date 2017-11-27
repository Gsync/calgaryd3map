//let w = +d3.select('.chart-container').node().offsetWidth;
const w = 560
const h = 400;
const p = 50;
const mapurl = './data/CensusByCommunity2016Topo.json';
const dataurl = './data/Calgary_Business_Licensesv2.csv';
/* Data source: data.calgary.ca  */

d3.queue()
    .defer(d3.json, mapurl)
    .defer(d3.csv, dataurl, row => {
        return {
            name: row.TRADENAME,
            licenceType: row.LICENCETYPES2,
            community: row.COMMUNITY,
            licenseStatus: row.JOBSTATUSDESC,
            year: (new Date(row.JOBCREATED)).getFullYear()
        }
    })
    .await((error, mapData, data) => {
        if (error) throw error;
        let minYear = d3.min(data, d => d.year);
        let maxYear = d3.max(data, d => d.year);
        let geodata = topojson.feature(mapData, mapData.objects.CensusByCommunity2016);
        createMap(w, h);
        drawMap(geodata, data);
        createBar(w, h);
        drawBar(data, "");

        //tooltip
        d3.selectAll('svg')
            .on('mousemove touchmove', updateTooltip);

        function updateTooltip() {
            let tooltip = d3.select('.tooltip');
            let target = d3.select(d3.event.target);
            let isCommunity = target.classed('community');
            let isBar = target.classed('bar');
            let data;

            if (isCommunity) data = target.data()[0].properties;
            if (isBar) data = target.data()[0];

            tooltip
                .style('opacity', +(isCommunity || isBar))
                .style('left', (d3.event.pageX - tooltip.node().offsetWidth / 2) + 'px')
                .style('top', (d3.event.pageY - tooltip.node().offsetHeight - 2) + 'px');
            if (data) {
                tooltip.html(`
                <p>Community: ${data.name}</p>
                <p>Male: ${data.male_cnt}</p>
                <p>Female: ${data.female_cnt}</p>
                `)
            }
        }


        d3.select('#dropdown')
            .on('input', function () {
                let community = d3.event.target.value;
                drawBar(data, community);
            });

    })