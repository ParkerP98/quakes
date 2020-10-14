// Creating map object
var myMap = L.map("map", {
    center: [36.7783, -119.4179],
    zoom: 7
  });
  
  // Adding tile layer to the map
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/streets-v11',
    accessToken: API_KEY
  }).addTo(myMap);
  
  //Earthquare json query url
  var URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

  //color variables
  var color_one = '#ffba08'
  var color_two = '#f48c06'
  var color_three = '#d00000'
  var color_four = '#6a040f'
  var color_five = '#370617'
  var color_six = '#03071e'
  
  //Function to choose appropriate color for mapping, green --> white
  function which_color (m)
  { var c = '';
  if (m < 2.5) c = color_one;
  else if (m < 5.4) c = color_two;
  else if (m < 6) c = color_three;
  else if (m < 6.9) c = color_four;
  else if (m < 7.9) c = color_five;
  else c = color_six;
  console.log(m);
  return (c);
  }
  
  //D3 URL response function
  d3.json(URL, function(response) {
  
    console.log(response)
  
    //looping through data (features)
    for (var i = 0; i < response.features.length; i++) {
      var f = response.features[i];
      var loc = f.geometry;
      var mags = f.properties.mag;
      var depth = loc.coordinates[2];

      //checking if loc == TRUE  , --->
      if (loc) {
        //create circle markers and pop up features
        L.circleMarker([loc.coordinates[1], loc.coordinates[0]],
          {"radius": mags*5,
            "fillColor": which_color(mags),
            "fillOpacity": 1,
            "color": "black",
            "weight": 0.5,
            "opacity": 1
          })
          .bindPopup(response.features[i].properties.place+
                    "<hr>Time = "+ (new Date(f.properties.time)).toLocaleString()+
                    "<br>Magnitudes = "+mags+
                    "<br>Depth = "+depth)
          .addTo(myMap)
      }
    }

    //initialize legend variable
    var legend = L.control({ position: "bottomright" });
    
    legend.onAdd = function() { var div = L.DomUtil.create('div', 'info legend')
          
    div.innerHTML = "<table style= 'background-color: white'><tr><td colspan='2' ><h3>&nbsp;&nbsp;Magnitude </h3></td></tr>"+
                    "<tr><td><2.5</td><td style= 'background-color: #ffba08'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>"+
                    "<tr><td>2.5-5.4</td><td style= 'background-color: #f48c06'></td></tr>"+
                    "<tr><td>5.4-6-50</td><td style= 'background-color: #d00000'></td></tr>"+
                    "<tr><td>6-6.9</td><td style= 'background-color: #6a040f'></td></tr>"+
                    "<tr><td>6.9-7.9</td><td style= 'background-color: #370617'></td></tr>"+
                    "<tr><td>7.9<</td><td style= 'background-color: #03071e'></td></tr>"+
                    "</table>";
  
    return div;
  };
  
  legend.addTo(myMap);
  
  });