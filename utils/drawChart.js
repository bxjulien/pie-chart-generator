import * as d3 from "d3";

const drawChart = (element, data, donut, ratio, displayName) => {
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
    .cornerRadius(donut ? 12 : 0)
    .padAngle(donut ? 0.06 : 0)
    .innerRadius(donut ? 100 : 0)
    .outerRadius((d) => {
      return ratio ? (250 - (maxValue - d.value)) : (250 - maxValue); // ratio de grandeurs
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
    .text((d) => `${displayName ? d.data.name : (d.data.value + '%')}`) // label text
    .style("fill", "white") // label color
    .attr("transform", (d) => {
      const [x, y] = arcGenerator.centroid(d);
      return `translate(${x}, ${y})`;
    })
    .transition()
    .duration(700)
    .style("font-size", "22px");
};

export default drawChart;
