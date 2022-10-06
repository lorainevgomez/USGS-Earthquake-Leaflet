
   // Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});


//Magnitude size reflects circles markers on the map
function size(mag)
{
    return mag* 20000;
  }
  
  // Loop thru the features and create one marker for each place object
  function depthColors(depth) {
    var color = "";
    if (depth <= 10 ) {
      return color = "#66ff33";
    }
    else if (depth <= 30) {
      return color = "#ccff66";
    }
    else if (depth <= 50) {
      return color = " #ffb366";
    }
    else if (depth <= 70) {
      return color = "#ff751a";
    }
    else if (depth <= 90) {
      return color = "#ff5050";
    }
    else if (depth > 90) {
      return color = "#cc2900";
    }
    else {
      return color = "#cc0000";
    }
  }



function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><hr><p2>Time: ${new Date(feature.properties.time)}</p2><hr><p3>Depth of Earthquake: ${feature.geometry.coordinates[2]}</p3>`)
  }
     

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

    pointToLayer: function (feature, coordinates) {
      // Determine Marker Colors, Size, and depth
      var quakeMarkers = {
        radius: size(feature.properties.mag),
        fillColor: depthColors(feature.geometry.coordinates[2]), //The depth of the earth is found by the third coordinate for each earthquake
        fillOpacity: 1,
        weight: 1,
        

      }
      return L.circle(coordinates, quakeMarkers);
    }


  });


  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4.5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'),
    depthQuakes = [-10, 10, 30, 50, 70, 90];
    labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depthQuakes.length; i++) {
        div.innerHTML +=
            '<i style="background:' + depthColors(depthQuakes[i] + 1) + '"></i> ' +
            depthQuakes[i] + (depthQuakes[i + 1] ? '&ndash;' + depthQuakes[i + 1] + '<br>' : '+');
}

return div;
};

legend.addTo(myMap);      

}