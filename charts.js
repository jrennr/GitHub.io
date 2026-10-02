const sampleData = d3.json("samples.json");
let chartRequest = 0;

function buildCharts(sample) {
  const request = ++chartRequest;
  sampleData.then((data) => {
    if (request !== chartRequest) return;

    const samples = data.samples;

    const resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    const result = resultArray[0];
    if (!result) return;

    const otuIds = result.otu_ids;
    const otuLabels = result.otu_labels;
    const sampleValues = result.sample_values;

    const yticks = otuIds.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse();

    const barData = [{
      x: sampleValues.slice(0, 10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h",
      text: otuLabels.slice(0, 10).reverse()
    }];

    const barLayout = {
      title: "Top 10 Bacterial Species",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };

    Plotly.newPlot("bar", barData, barLayout, {responsive: true});

    const bubbleData = [{
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

    const bubbleLayout = {
      title: "Bacterial Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" },
      hovermode: "closest"
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive: true});

    const metadata = data.metadata;
    const resultArrayMetadata = metadata.filter(sampleObj => sampleObj.id == sample);

    const resultMetadata = resultArrayMetadata[0];
    const metadataPanel = d3.select('#sample-metadata');
    metadataPanel.html('');
    if (!resultMetadata) return;
    Object.entries(resultMetadata).forEach(([key, value]) => {
      metadataPanel.append('p').text(`${key}: ${value}`);
    });

    const washingFrequency = Number(resultMetadata.wfreq ?? 0);

    const gaugeData = [{
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

    const gaugeLayout = {
      height: 400,
      margin: { t: 0, b: 0 },
      font: { color: "darkblue", family: "Arial" }
    };

    Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive: true});

  }).catch(() => {
    if (request === chartRequest) d3.select('#sample-metadata').text('Unable to load sample data.');
  });
}

sampleData.then((data) => {
  const select = d3.select('#selDataset');
  select.html('');
  data.names.forEach((name) => select.append('option').property('value', name).text(name));
  if (data.names.length) buildCharts(data.names[0]);
}).catch(() => d3.select('#sample-metadata').text('Unable to load sample data.'));

function optionChanged(newSample) {
  buildCharts(newSample);
}
