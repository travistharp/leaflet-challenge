// USGS API URL- past 30 days, 2.5 magnitude and greater
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"

//Marker circles sized by magnitude of quake-- The richter scale is logarithmic, but
//the markers for the larger quakes were too large. I still wanted there to be a difference, so 
//I made the markers the square of the maginitude, multiplied by 2000.
function markerSize(mag) {
  return Math.pow(mag, 2)*1000;
}

function markerColor(magnitude) {
  if (magnitude < 3) {
      return "#00ff2f";
  } else if (magnitude < 4) {
      return "#80FF00";
  } else if (magnitude < 5) {
      return "#f6ff00";
  } else if (magnitude < 6) {
      return "#FFc800";
  } else if (magnitude < 7) {
      return "#ff0000";
  } else {
      return "#ff00fb";
  };
}

//Use d3.json to get the data from the USGS
d3.json(url, function(data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {

 onEachFeature : function (feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p> Date: " + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>")
    },     pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.properties.mag),
        fillOpacity: 0.75,
        stroke: false,
    })
  }
  });
    


  //add the earthquake layer to the map
  createMap(earthquakes);
} 

function createMap(earthquakes) {

  //Map layers- Satellite and light
  var satelitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: "pk.eyJ1IjoidHJhdm1hbjEwMzEiLCJhIjoiY2s5enI1MG5mMGQzYzNzcGg4N3l2Mmk5ayJ9.CTweGvDahbiIBUGqLzbrEg"
  });

  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: "pk.eyJ1IjoidHJhdm1hbjEwMzEiLCJhIjoiY2s5enI1MG5mMGQzYzNzcGg4N3l2Mmk5ayJ9.CTweGvDahbiIBUGqLzbrEg"
  });

  // basemap for map types
  var baseMaps = {
    "Satelite Map": satelitemap,
    "Light Map": lightmap
  };

  // Create overlay object to hold the overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  //Create the map, centered on Kansas City
  var myMap = L.map("map", {
    center: [39.0997,-94.5786],
    zoom: 3,
    layers: [lightmap, earthquakes]
  });


  //Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
  
      var div = L.DomUtil.create('div', 'info legend'),
          magnitudes = [2.0, 3.0, 4.0, 5.0, 6.0, 7.0];
  
      for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + markerColor(magnitudes[i]) + '"></i> ' + magnitudes[i] + '-'+magnitudes[i + 1.0]+'<br>';}

  
      return div;
  };
  
  // legend.addTo(myMap);

  // Adding legend to the map
  legend.addTo(myMap);


}