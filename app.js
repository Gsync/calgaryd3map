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
    })