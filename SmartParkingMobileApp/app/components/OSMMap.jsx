import React from "react";
import { Dimensions } from "react-native";
import { WebView } from "react-native-webview";

const { width, height } = Dimensions.get("window");

export default function MapTilerMap({markers, selectedMarker}) {
  const MAPTILER_KEY = 'iShCirJLJoQETgVEx01A';  
  const markersJS = JSON.stringify(markers);
  const selectedMarkerJS = selectedMarker ? JSON.stringify(selectedMarker) : 'null';
  const leafletHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet/dist/leaflet.css"
        />
        <style>
          html, body, #map { height: 100%; margin: 0; padding: 0; }
           .custom-div-icon {
            background: none;
            border: none;
        }
        
        .ripple-container {
            position: relative;
            width: 54px;
            height: 54px;
        }
        
        .ripple-circle {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            height: 10px;
            background-color: rgba(233, 12, 51, 0.3);
            border: 2px solid #e90c33;
            border-radius: 50%;
            animation: ripple 2.3s infinite ease-out;
        }
        
        .ripple-circle-2 {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            height: 10px;
            background-color: rgba(240, 70, 141, 0.3);
            border: 2px solid #f0468d;
            border-radius: 50%;
            animation: ripple 2.3s infinite ease-out;
            animation-delay: -1.15s;
        }
        
        @keyframes ripple {
            0% {
                width: 0px;
                height: 0px;
                opacity: 1;
            }
            100% {
                width: 80px;
                height: 80px;
                opacity: 0;
            }
        }

        .marker-dot {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            height: 10px;
            background-color: #e90c33;
            border-radius: 50%;
            z-index: 10;
        }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
          
          var map = L.map('map').setView([-34.734277, -58.390483], 19);

          // MapTiler tiles
          L.tileLayer('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}', {
            attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> © OpenStreetMap contributors',
            tileSize: 512,
            zoomOffset: -1,
            crossOrigin: true
          }).addTo(map);


          var markers = ${markersJS};
          var selected = ${selectedMarkerJS};
         var leafletMarkers = [];

          markers.forEach(m => {
            var lat = parseFloat(m.latitude);
            var lng = parseFloat(m.longitude);

            // Ripple color based on status
            var color = m.status === "libre" ? "#00e676" : "#ff1744";

            var rippleIcon = L.divIcon({
              html: \`
                  <div class="ripple-container">
                      <div class="ripple-circle" style="border-color:\${color};"></div>
                      <div class="ripple-circle-2" style="border-color:\${color};"></div>
                      <div class="marker-dot" style="background:\${color};"></div>
                  </div>
              \`,
              className: 'custom-div-icon',
              iconSize: [54, 54],
              iconAnchor: [27, 27],
              popupAnchor: [0, -30]
            });

            var marker = L.marker([lat, lng], { icon: rippleIcon })
              .addTo(map)
              .bindPopup(m.name + " (" + m.status + ")");
            
            leafletMarkers.push({ data: m, marker });
          });

          if (selected) {
            var match = leafletMarkers.find(lm => lm.data.id === selected.id);
            if (match) {
              map.setView([parseFloat(match.data.latitude), parseFloat(match.data.longitude)], 20);
              match.marker.openPopup();
            }
          }
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ html: leafletHTML }}
      style={{ width: width, height: height / 3 }} // 100% width, 1/3 height
    />
  );
}
