// Load the data
const socialMedia = d3.csv("socialMedia.csv");

// Once the data is loaded, proceed with plotting
socialMedia.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.Likes = +d.Likes;
    });

    // Define the dimensions and margins for the SVG
    let
      width = 400,
      height = 400;
  
    let margin = {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20
    };

    // Create the SVG container
    let svg = d3.select('#boxplot')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .style('background', 'white');

    // Set up scales for x and y axes
    // You can use the range 0 to 1000 for the number of Likes, or if you want, you can use
    // d3.min(data, d => d.Likes) to achieve the min value and 
    // d3.max(data, d => d.Likes) to achieve the max value
    // For the domain of the xscale, you can list all four platforms or use
    // [...new Set(data.map(d => d.Platform))] to achieve a unique list of the platform

    // xscale
    let xScale = d3.scaleBand()
      .domain([...new Set(data.map(d => d.Platform))])  // Unique platforms
      .range([margin.left, width - margin.right])  // Horizontal space
      .padding(0.5);  // Padding between bars
    
    // yscale 
    let yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Likes)]) // Setting domain from 0 to max likes 
      .range([height - margin.bottom, margin.top]);
    
    // inpus axis and inputting x-axis label
    let xAxis = svg
      .append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom().scale(xScale));

    xAxis
      .append('text')
        .attr('x', width - margin.left)
        .attr('y', -20)
        .style('stroke', 'Blue')
        .text('Platform');

    // inpus axis and inputting y-axis label
    let yAxis = svg
      .append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));

    yAxis
      .append('text')
        .attr('y', 30)
        .attr('x', 20)
        .style('stroke', 'Green')
        .text('Likes');

    const rollupFunction = function(groupData) {
        const values = groupData.map(d => d.Likes).sort(d3.ascending);
        const min = d3.min(values); 
        const q1 = d3.quantile(values, 0.25); 
        const median = d3.quantile(values, 0.5); 
        const q3 = d3.quantile(values, 0.75);  
        const iqr = q3 - q1; 
        const max = d3.max(values); 
        
        return { min, q1, median, q3, max, iqr };
    };

    const quantilesByGroups = d3.rollup(data, rollupFunction, d => d.Platform);

    quantilesByGroups.forEach((quantiles, Platform) => {
        const x = xScale(Platform); 
        const boxWidth = xScale.bandwidth(); 

        // Draw the vertical whisker line (from min to max)
svg.append('line')
.attr('x1', x + boxWidth / 2)  // Center of the box
.attr('y1', yScale(quantiles.min))  // Start at minimum value
.attr('x2', x + boxWidth / 2)  // Center of the box
.attr('y2', yScale(quantiles.max))  // End at maximum value
.attr('stroke', 'black')  // Line color
.attr('stroke-width', 2);  // Line thickness

// Draw the box (interquartile range)
svg.append('rect')
.attr('x', x)  // X position of the box
.attr('y', yScale(quantiles.q3))  // Y position for Q3
.attr('width', boxWidth)  // Width of the


// Prepare you data and load the data again. 
// This data should contains three columns, platform, post type and average number of likes. 
const socialMediaAvg = d3.csv("socialMediaAvg.csv");

socialMediaAvg.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
      d.AvgLikes = +d.AvgLikes;
    });

    // Define the dimensions and margins for the SVG
    let
      width = 400,
      height = 400;
  
    let margin = {
      top: 30,
      bottom: 30,
      left: 30,
      right: 10,
    };

    // Create the SVG container
    let svg = d3.select('#barplot')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .style('background', 'white');

    // Define four scales
    // Scale x0 is for the platform, which divide the whole scale into 4 parts
    // Scale x1 is for the post type, which divide each bandwidth of the previous x0 scale into three part for each post type
    // Recommend to add more spaces for the y scale for the legend
    // Also need a color scale for the post type

    const x0 = d3.scaleBand()
      .domain(data.map(d => d.Platform)) 
      .range([0, width])
      .padding(0.5);

    const x1 = d3.scaleBand()
      .domain([...new Set(data.map(d => d.PostType))])  
      .range([0, x0.bandwidth()])  
      .padding(0.2);  

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.AvgLikes)]) 
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
      .domain([...new Set(data.map(d => d.PostType))])
      .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);    
         
    // Add scales x0 and y     
    
    let xScale = d3.scaleBand()
      .domain([...new Set(data.map(d => d.Platform))]) 
      .range([margin.left, width - margin.right])  
      .padding(0.1);  =
    
    let yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.AvgLikes)])
      .range([height - margin.bottom, margin.top]);

    // Add x-axis label

    let xAxis = svg
      .append('g')
        .attr('transform', `translate(0,${height - margin.bottom+10})`)
        .call(d3.axisBottom().scale(xScale));

    xAxis
      .append('text')
        .attr('x', width / 2)
        .attr('y', 35)
        .style('stroke', 'black')
        .text('Platform');

    // Add y-axis label

    let yAxis = svg
      .append('g')
        .attr('transform', `translate(${margin.left - 20},0)`)
        .call(d3.axisLeft().scale(yScale));

    yAxis
      .append('text')
        .attr('y', 20)
        .attr('x', 40)
        .style('stroke', 'black')
        .text('Average Like');

  // Group container for bars
    const barGroups = svg.selectAll("bar")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${x0(d.Platform) + 20},0)`);

  // Draw bars
    barGroups.append("rect")
      .attr("x", d => x1(d.PostType)) 
      .attr("y", d => y(d.AvgLikes))  
      .attr("width", x1.bandwidth())  
      .attr("height", d => height - margin.bottom - y(d.AvgLikes))  
      .attr("fill", d => color(d.PostType));  
      

    // Add the legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 70}, ${margin.top - 20})`);

    const types = [...new Set(data.map(d => d.PostType))];
 
    types.forEach((type, i) => {

    // Alread have the text information for the legend. 
    // Now add a small square/rect bar next to the text with different color.
      legend.append("text")
          .attr("x", 20)
          .attr("y", i * 20 + 12)
          .text(type)
          .attr("alignment-baseline", "middle");
          
      legend.append("rect")
        .attr("x", 0)
        .attr("y", i * 20 + 5)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", color(type));
  });

});

// Prepare you data and load the data again. 
// This data should contains two columns, date (3/1-3/7) and average number of likes. 

const socialMediaTime = d3.csv("socialMediaTime.csv");

socialMediaTime.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
      d.AvgLikes = +d.AvgLikes;
    });

    // Define the dimensions and margins for the SVG
    let
      width = 500,
      height = 300;
  
    let margin = {
      top: 20,
      bottom: 90,
      left: 30,
      right: 10
    };

    // Create the SVG container
    let svg = d3.select('#lineplot')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .style('background', 'white');

    // Set up scales for x and y axes  
    let xScale = d3.scaleBand()
      .domain(data.map(d => d.Date))
      .range([margin.left, width - margin.right])
      .padding(0.1); 
      
    let yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.AvgLikes)]) // setting domain from 0 to max avg likes 
      .range([height - margin.bottom, margin.top]);

    // Draw the axis, you can rotate the text in the x-axis here
    let xAxis = svg
      .append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom().scale(xScale))
        .selectAll("text") // select all texts 
          // rotate texts 
          .style("text-anchor", "end")  
          .attr("transform", "rotate(-25)"); 

    // drawing axis and adding y-axis label
    let yAxis = svg
      .append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));

    // Add x-axis label
    svg
      .append('text')
        .attr('x', width/2)
        .attr('y', height - 15)
        .style('stroke', 'black')
        .text('Dates');

    // Add y-axis label
    yAxis
      .append('text')
        .attr('y', 10)
        .attr('x', 0)
        .style('stroke', 'black')
        .text('Average Likes');



    // Draw the line and path. Remember to use curveNatural. 
    let line = d3.line()
            .x(d => xScale(d.Date) + xScale.bandwidth()/2)
            .y(d => yScale(d.AvgLikes))
            .curve(d3.curveNatural)

    svg.append('path')
       .datum(data)
       .attr('d', line)
       .attr('fill', 'none')
       .attr('stroke', 'blue')
       .attr('stroke-width', 3)
});
