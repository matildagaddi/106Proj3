import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Sample data structure
const data = [
  { Municipality: "Saldaña", CasesPer1000: 47.6, DistanceToHospital: 7.3, Population: 14450},
  { Municipality: "Capitanejo", CasesPer1000: 45.6, DistanceToHospital: 4.5, Population: 5479 },
  { Municipality: "San Martín", CasesPer1000: 35.9, DistanceToHospital: 27.3, Population: 26571 },
  { Municipality: "Leticia", CasesPer1000: 34.3, DistanceToHospital: 10.6, Population: 48918 },
  { Municipality: "Medina", CasesPer1000: 32.2, DistanceToHospital: 21.9, Population: 8064 },
  { Municipality: "Cubarral", CasesPer1000: 31.8, DistanceToHospital: 18.1, Population: 7019 },
  { Municipality: "Alvarado", CasesPer1000: 28.9, DistanceToHospital: 8.82, Population: 8710 },
  { Municipality: "San Luis de Gaceno", CasesPer1000: 27.8, DistanceToHospital: 10.7, Population: 5476 },
  { Municipality: "Baraya", CasesPer1000: 27.2, DistanceToHospital: 13.7, Population: 8282 },
];

// Set up dimensions
const margin = { top: 160, right: 50, bottom: 80, left: 180 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create SVG
const svg = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Create scales
const xScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.CasesPer1000)])
  .range([0, width]);

const yScale = d3.scaleBand()
  .domain(data.map(d => d.Municipality))
  .range([0, height])
  .padding(0.2);

const colorScale = d3.scaleSequential(d3.interpolateReds)
  .domain([d3.min(data, d => d.DistanceToHospital), d3.max(data, d => d.DistanceToHospital)]);

  
// Tooltip container
const tooltip = d3.select("#tooltip");

// Draw bars
svg.selectAll(".bar")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("y", d => yScale(d.Municipality))
  .attr("height", yScale.bandwidth())
  .attr("x", 0)
  .attr("width", d => xScale(d.CasesPer1000))
  .attr("fill", d => colorScale(d.DistanceToHospital))
  .on("mouseover", function(event, d) {
    // Show the tooltip with population and distance
    tooltip.style("display", "block")
      .html(`
        <strong>Municipality:</strong> ${d.Municipality} <br>
        <strong>Population:</strong> ${d.Population.toLocaleString()} <br>
        <strong>Distance to Nearest Hospital:</strong> ${d.DistanceToHospital} km
      `)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 40) + "px");
  })
  .on("mousemove", function(event) {
    // Update the position of the tooltip as the mouse moves
    tooltip.style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 40) + "px");
  })
  .on("mouseout", function() {
    // Hide the tooltip when the mouse leaves the bar
    tooltip.style("display", "none");
  });



// Draw bars
svg.selectAll(".bar")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("y", d => yScale(d.Municipality))
  .attr("height", yScale.bandwidth())
  .attr("x", 0)
  .attr("width", d => xScale(d.CasesPer1000))
  .attr("fill", d => colorScale(d.DistanceToHospital));

// Add text labels
svg.selectAll(".label")
  .data(data)
  .enter()
  .append("text")
  .attr("x", d => xScale(d.CasesPer1000) + 5)
  .attr("y", d => yScale(d.Municipality) + yScale.bandwidth() / 2)
  .attr("dy", "0.35em")
  .text(d => d.CasesPer1000.toFixed(1))
  .style("font-size", "12px")
  .style("fill", "#333");

// Add x-axis
svg.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(xScale).ticks(5))
  .selectAll("text")
  .style("font-size", "12px");

// Add y-axis
svg.append("g")
  .call(d3.axisLeft(yScale))
  .selectAll("text")
  .style("font-weight", "bold");

// Add vertical average line
const avgCases = 3//d3.mean(data, d => d.CasesPer1000);
svg.append("line")
  .attr("x1", xScale(avgCases))
  .attr("x2", xScale(avgCases))
  .attr("y1", 0)
  .attr("y2", height)
  .attr("stroke", "red")
  .attr("stroke-dasharray", "5,5");

// Add annotation for average
svg.append("text")
  .attr("x", xScale(avgCases) + 5)
  .attr("y", -10)
  .attr("fill", "red")
  .style("font-size", "12px")
  .text("City Average: " + avgCases.toFixed(1));

// Add title and subtitle
svg.append("text")
  .attr("x", width / 2)
  .attr("y", -120)
  .attr("text-anchor", "middle")
  .style("font-size", "18px")
  .style("font-weight", "bold")
  .text("Top Dengue Spreading Cities in Colombia");

svg.append("text")
  .attr("x", width / 2)
  .attr("y", -90)
  .attr("text-anchor", "middle")
  .style("font-size", "12px")
  .html("Dengue is a mosquito-borne viral infection that can cause severe illness.<br>Travelers should be cautious, especially in these cities with high spread-rate.")
  .style("fill", "#666");

// Add data source annotation
svg.append("text")
  .attr("x", width - 10)
  .attr("y", height + 50)
  .attr("text-anchor", "end")
  .style("font-size", "10px")
  .style("fill", "#666")
  .text("Data from physionet.org/content/multimodal-satellite-data/1.0.0/");
