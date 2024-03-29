function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/data/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/data/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("static/data/samples.json").then((data) => {
    // Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    // Create a variable that holds the metadata array.
    var metadataArray = data.metadata;
    // Create a variable that filters the samples for the object with the desired sample number.
    var sampleArrayId = samplesArray.filter(data => data.id == sample);
    // Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArrayId = metadataArray.filter(data => data.id == sample);
    // Create a variable that holds the first sample in the array.
    var firstSample = sampleArrayId[0];
    // Create a variable that holds the first sample in the metadata array.
    var firstMetadata = metadataArrayId[0]; 
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;
    // Create a variable that holds the washing frequency.
    var washFreq = firstMetadata.wfreq;
    // Create the yticks for the bar chart.
    var yticks = otuIds.slice(0, 10).map(id => "OTU: " + id).reverse(); 
    // Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0, 10).reverse(),
      text: otuLabels.slice(0, 10).reverse(),
      type: "bar",
      marker: {
        color: "rgb(128, 125, 134)"
      }  
    }];

    // Create the layout for the bar chart. 
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      yaxis: {
        tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        ticktext: yticks
      },
      xaxis: {
        title: "Number of Samples Found <br> In Belly Button",
      },
      paper_bgcolor: "rgb(129, 145, 129)"   
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout, {responsive: true});

    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Portland"
      },
      paper_bgcolor: "rgb(129, 145, 129)"
    }];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      showlegend: false,
      xaxis: {
        title: "OTU ID",
        automargin: true
      },
      yaxis: {
        automargin: true
      },
      hovermode: "closest",
      paper_bgcolor: "rgb(129, 145, 129)"
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive: true}); 
    
    // Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
		  value: washFreq,
		  title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week" },
	    type: "indicator",
		  mode: "gauge+number",
      gauge: {
        axis: {
          range: [null, 10], 
          tickvals: [0, 2, 4, 6, 8, 10]
        },
        bar: {
          color: "black"
        },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "yellowgreen" },
          { range: [8, 10], color: "green" }
        ]
      }
    }];
    
    // Create the layout for the gauge chart.
    var gaugeLayout = {
      autosize: true,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "rgb(129, 145, 129)"
    };

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive: true});
  });
}
