const url = "./static/js/samples.json";
namesNew = [];
var sampleId = [];

function get_some_data_we_get_back(){}

//function to populate dropdown menu

function sampleData(){

  
  var dropDownMenu = d3.select("#selDataset");
   
    d3.json(url).then(data => {
      console.log('------', data.names);
      var names = data.names;
      names.forEach(name => {
        dropDownMenu.append("option").text(name).property("value", name);
      });

    });
  

};

// when dropdown is changed, 
// data table and charts are updated
function optionChanged(newSample) {
  updateTable(newSample);
  updateBar(newSample);
  updateBubble(newSample);
  updateGuage(newSample);
}

// function to produce demographics table
function updateTable(name) {
  d3.json(url).then(data => {
    var metadata = data.metadata;
    var metaList = [];
    //Fliter dataset to match to the dropdown choice
      for (i=0; i < metadata.length; i++) {
        if (metadata[i].id == name) {
          metaList.push(metadata[i]);
        }
      }
    var nMeta = metaList[0];
    console.log("Meta list", nMeta);
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    Object.entries(nMeta).forEach(([key, value]) => {
      PANEL.append("h6").text(key.toUpperCase() + ': ' + value);
    });
  });
};
//function to update charts

function updateBar(name){

  d3.json(url).then(data => {
    var sampleList = [];
    //Extract all values for key: samples
    var nSamples = data.samples;
    //Fliter dataset to match to the dropdown choice
    for (i=0; i < nSamples.length; i++) {
      if (nSamples[i].id == name) {
        sampleList.push(nSamples[i]);
        // console.log("Filtered list", sampleList);
      }


    }
    //Extract ID from samples list
    sample1 = sampleList[0];
    console.log("Filtered list", sample1);

    // put all three arrays into dictionary format
    var sampleData = [];

    for (i = 0; i < sample1.otu_ids.length; i++) {
          sampleData.push({
            otu_ids: sample1.otu_ids[i],
            sample_values: sample1.sample_values[i],
            otu_labels: sample1.otu_labels[i]
          });
        };

        // get the top ten results
        var topTenResult = sampleData.sort((a,b) => a.sample_values-b.sample_values).reverse().slice(0,10);
    
        // vars for the bar chart
        var values = topTenResult.map(val=>val.sample_values);
        var labels = topTenResult.map(lab=>"UTO "+lab.otu_ids);
        var hoverText = topTenResult.map(t=>t.otu_labels);

        var PANEL = d3.select("#bar");

        PANEL.html("");
        var barData = {
          x: values,
          y: labels,
          text: hoverText,
          type: "bar",
          orientation: "h" ,
          marker: {
            colorscale: 'Jet',
            color: values,
            width: 1
          }
        };
    
        var layout = {
          title: "Top 10 OTU)",
          xaxis:{title: "Sample IDs"},
          yaxis:{
            title:"UTO IDs",
            autorange:'reversed'
          }
        };
    
        Plotly.newPlot("bar", [barData], layout);
    console.log("Filtered new", sampleData);
  });
}

// function to produce the bubble chart
function updateBubble(name){

  d3.json(url).then(data => {
    var sampleList = [];
    //Extract all values for key: samples
    var nSamples = data.samples;
    //Fliter dataset to match to the dropdown choice
    for (i=0; i < nSamples.length; i++) {
      if (nSamples[i].id == name) {
        sampleList.push(nSamples[i]);
        // console.log("Filtered list", sampleList);
      }


    }
    //Extract ID from samples list
    sample1 = sampleList[0];
    // set the data arrays
    var values = sample1.sample_values;
    var ids = sample1.otu_ids;
    var labels = sample1.otu_labels;

    var PANEL = d3.select("#bubble");

    PANEL.html("");
    var bubbleTrace = {
      x: ids,
      y: values,
      text: labels,
      mode: 'markers',
      marker:{
        colorscale: 'Jet',
        color: ids,
        size: values
      }
    };
    
    var bubbleLayout = {
      title: "OTU Sample value",
      xaxis:{title: "OTU ID"},
      yaxis:{title: "Sample value"}
    }

    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);
  });  
};

// function to produce the bubble chart
function updateGuage(name){

  d3.json(url).then(data => {
    var metadata = data.metadata;
    var metaList = [];
    //Fliter dataset to match to the dropdown choice
      for (i=0; i < metadata.length; i++) {
        if (metadata[i].id == name) {
          metaList.push(metadata[i]);
        }
      }
    var nMeta = metaList[0];

  
    // set the data arrays
    var washFreq = nMeta.wfreq;
    var ids = sample1.otu_ids;


    var PANEL = d3.select("#gauge");

    PANEL.html("");
    var guageData = {
        type: "pie",
        showlegend: false,
        hole: 0.5,
        rotation: 270,
        values: washFreq,
        text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "", "", "", "","","","","",""],
        direction: "clockwise",
        textinfo: "text",
        textposition: "inside",
        marker: {
          
          colors: ["rgb(180,180,0,0.6)", "rgb(161,198,0,0.7)", "rgb(140,213,0,0.8)", "rgba(114,228,0,0.9)", "rgba(81,242,0,1)", "rgba(0,255,0,1)", "rgba(25,230,0,0.9)", "rgba(51,204,51,0.8)", "rgba(77,179,0,0.8)","white","white","white","white","white","white","white","white","white"]
        },
        labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "", "", "", "","","","","",""],
        height: 500,
        width: 600,
        hoverinfo: "label"
      };


      
      var degrees = washFreq*20, radius = .5;
      var radians = degrees * Math.PI / 180;
      var x = -1 * radius * Math.cos(radians);
      var y = radius * Math.sin(radians);



      var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
     var path = mainPath.concat(pathX,space,pathY,pathEnd);
      

      var layout = {
        annotations: [{
          ax: 0.5,
          ay: 0,

          x: 0.5+x,
          y: y,
          xref: 'x',
          yref: 'y',
      

        }],
        shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
        color: '850000'
        }
        }],
      
        title: 'Belly Button Wash Frequency',
        xaxis: {visible: false, range: [-1, 1]},
        yaxis: {visible: false, range: [-1, 1]}
      };
      

    Plotly.newPlot(gauge, [guageData], layout,  {staticPlot: true});

  });  
};

sampleData();
optionChanged('940');
