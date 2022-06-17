import * as d3 from "d3";

const drawChart = (element, chartState) => {
  const { data, chartType, slicesRatio, sliceContentType } = chartState;

  const boxSize = 500;

  d3.select(element).select("svg").remove();

  const svg = d3
    .select(element)
    .append("svg")
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("viewBox", `0 0 ${boxSize} ${boxSize}`)
    .append("g")
    .attr("transform", `translate(${boxSize / 2}, ${boxSize / 2})`);

  const maxValue = data.reduce((cur, val) => Math.max(cur, val.value), 0);
  const arcGenerator = d3
    .arc()
    .cornerRadius(chartType === 'Donut' ? 12 : 0)
    .padAngle(chartType === 'Donut' ? 0.06 : 0)
    .innerRadius(chartType === 'Donut' ? 100 : 0)
    .outerRadius((d) => {
      return slicesRatio ? (250 - (maxValue - d.value)) : (250 - maxValue); // ratio de grandeurs
    });

  const pieGenerator = d3
    .pie()
    .startAngle(-0.75 * Math.PI)
    .value((d) => d.value);

  const arcs = svg.selectAll().data(pieGenerator(data)).enter();
  arcs
    .append("path")
    .attr("d", arcGenerator)
    .style("fill", (d) => d.data.color)
    .transition()
    .duration(700)
    .attrTween("d", function (d) {
      const i = d3.interpolate(d.startAngle, d.endAngle);
      return function (t) {
        d.endAngle = i(t);
        return arcGenerator(d);
      };
    });

  // Append text labels
  arcs
    .append("text")
    .attr("text-anchor", "middle")
    .text((d) => getSliceContent(sliceContentType, d.data)) // label text
    .style("fill", "white") // label color
    .attr("transform", (d) => {
      const [x, y] = arcGenerator.centroid(d);
      return `translate(${x}, ${y})`;
    })
    .transition()
    .duration(700)
    .style("font-size", "22px");
};

const getSliceContent = (sliceContentType, data) => {
  let res = '';
  if (data.value) {
    if (sliceContentType === 'Text')
      res = data.name;
    if (sliceContentType === 'Value')
      res = data.value + '%';
    if (sliceContentType === 'Text Value')
      res = `${data.name} ${data.value}%`;
  }  
  return res;
}

export default drawChart;
