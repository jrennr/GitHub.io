function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = result.otu_ids;
    var otuLabels = result.otu_labels;
    var sampleValues = result.sample_values;

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = otuIds.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse();

    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0, 10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h",
      text: otuLabels.slice(0, 10).reverse()
    }];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacterial Species",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Deliverable 2: 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Earth"
      }
    }];

    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacterial Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" },
      hovermode: "closest"
    };

    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var resultArrayMetadata = metadata.filter(sampleObj => sampleObj.id == sample);

    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var resultMetadata = resultArrayMetadata[0];

    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var washingFrequency = parseFloat(resultMetadata.wfreq);

    // Deliverable 3: 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: washingFrequency,
      title: { text: "Belly Button Washing Frequency<br>Scrubs per Week" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "darkblue" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "darkgreen" }
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: washingFrequency
        }
      }
    }];

    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 500,
      height: 400,
      margin: { t: 0, b: 0 },
      font: { color: "darkblue", family: "Arial" }
    };

    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

      
        });
}

   // Call the buildCharts function.
   buildCharts("940");


   // Function to handle changes in the dropdown menu
   function optionChanged(newSample) {
   buildCharts(newSample);
       
  
}
