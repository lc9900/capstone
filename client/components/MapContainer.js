import React, { Component } from "react";
import { connect } from "react-redux";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";

export class MapContainer extends Component {
  constructor() {
    super();
  }

  render() {
    if (!this.props.loaded) {
      return <div>Loading...</div>;
    }
    const style = {
      width: "70%",
      height: "70%"
    };
    return (
      <div className="row">
        <Map
          className="gmap"
          google={this.props.google}
          style={style}
          initialCenter={{ lat: 40.705312, lng: -74.009197 }}
          zoom={15}
        />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAopJDwUG1vlrsZg94qP6yuPtzapUgYw8g"
})(MapContainer);

// let midpointLat = 40.771;
// let midpointLng = -73.974;
// var map;

// function initMap() {
//   map = new google.maps.Map(document.getElementById("map"), {
//     mapTypeControl: false,
//     center: { lat: 40.771, lng: -73.974 },
//     zoom: 13
//   });
//   new AutocompleteDirectionsHandler(map);
// }

// /**
//   * @constructor
//  */
// function AutocompleteDirectionsHandler(map) {
//   this.map = map;
//   this.originPlaceId = null;
//   this.destinationPlaceId = null;
//   this.travelMode = "WALKING";
//   var originInput = document.getElementById("origin-input");
//   var destinationInput = document.getElementById("destination-input");
//   var modeSelector = document.getElementById("mode-selector");
//   this.directionsService = new google.maps.DirectionsService();
//   this.directionsDisplay = new google.maps.DirectionsRenderer();
//   this.directionsDisplay.setMap(map);

//   var originAutocomplete = new google.maps.places.Autocomplete(originInput, {
//     placeIdOnly: true
//   });
//   var destinationAutocomplete = new google.maps.places
//     .Autocomplete(destinationInput, { placeIdOnly: true });

//   this.setupClickListener("changemode-walking", "WALKING");
//   this.setupClickListener("changemode-transit", "TRANSIT");
//   this.setupClickListener("changemode-driving", "DRIVING");

//   this.setupPlaceChangedListener(originAutocomplete, "ORIG");
//   this.setupPlaceChangedListener(destinationAutocomplete, "DEST");

//   this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
//   this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
//     destinationInput
//   );
//   this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
// }

// // Sets a listener on a radio button to change the filter type on Places
// // Autocomplete.
// AutocompleteDirectionsHandler.prototype.setupClickListener = function(
//   id,
//   mode
// ) {
//   var radioButton = document.getElementById(id);
//   var me = this;
//   radioButton.addEventListener("click", function() {
//     me.travelMode = mode;
//     me.route();
//   });
// };

// AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(
//   autocomplete,
//   mode
// ) {
//   var me = this;
//   autocomplete.bindTo("bounds", this.map);
//   autocomplete.addListener("place_changed", function() {
//     var place = autocomplete.getPlace();
//     if (!place.place_id) {
//       window.alert("Please select an option from the dropdown list.");
//       return;
//     }
//     if (mode === "ORIG") {
//       me.originPlaceId = place.place_id;
//     } else {
//       me.destinationPlaceId = place.place_id;
//     }
//     me.route();
//   });
// };

// AutocompleteDirectionsHandler.prototype.route = function() {
//   if (!this.originPlaceId || !this.destinationPlaceId) {
//     return;
//   }
//   var me = this;

//   this.directionsService.route(
//     {
//       origin: { placeId: this.originPlaceId },
//       destination: { placeId: this.destinationPlaceId },
//       travelMode: this.travelMode
//     },
//     function(response, status) {
//       const resp = response;
//       const tripDuration = response.routes[0].legs[0].duration.value;
//       console.log("response:", response);
//       console.log("Duration full trip (secs):", tripDuration);
//       const steps = response.routes[0].legs[0].steps;
//       let prevAccumDuration = 0;
//       let newAccumDuration = 0;
//       let logged = false;
//       for (var i = 0; i < steps.length; i++) {
//         const stepDuration = steps[i].duration.value;
//         newAccumDuration = prevAccumDuration + stepDuration;
//         if (newAccumDuration > tripDuration / 2 && !logged) {
//           console.log("** Halfway point on leg " + i);
//           const stepStartLat = steps[i].start_location.lat();
//           const stepStartLng = steps[i].start_location.lng();
//           const stepEndLat = steps[i].end_location.lat();
//           const stepEndLng = steps[i].end_location.lng();
//           console.log("stepStart:", stepStartLat, stepStartLng);
//           console.log("stepEnd:", stepEndLat, stepEndLng);
//           const percentIntoStepForMidway =
//             (tripDuration / 2 - prevAccumDuration) / stepDuration;
//           midpointLat =
//             stepStartLat +
//             (stepEndLat - stepStartLat) * percentIntoStepForMidway;
//           midpointLng =
//             stepStartLng +
//             (stepEndLng - stepStartLng) * percentIntoStepForMidway;
//           console.log("midpoint:", midpointLat, midpointLng);
//           logged = true;
//         }
//         prevAccumDuration = newAccumDuration;
//         console.log(
//           "Leg " +
//             i +
//             " (secs) = " +
//             stepDuration +
//             ", accumulated (secs) = " +
//             prevAccumDuration
//         );
//       }
//       // var marker = new google.maps.Marker({
//       //   position: {lat: midpointLat, lng: midpointLng},
//       //   map: map,
//       //   title: 'Rendezvous Area'
//       // });
//       if (status === "OK") {
//         service = new google.maps.places.PlacesService(map);
//         midpoint = new google.maps.LatLng(midpointLat, midpointLng);
//         var request = {
//           location: midpoint,
//           radius: "500",
//           type: ["restaurant"]
//         };
//         service.textSearch(request, callback);
//         let places = [];
//         function callback(results, status) {
//           if (status == google.maps.places.PlacesServiceStatus.OK) {
//             for (var i = 0; i < results.length; i++) {
//               var place = results[i];
//               // console.log('map:', map)
//               // createMarker(results[i]);

//               places.push({
//                 name: place.name,
//                 address: place.formatted_address
//               });
//             }
//             console.log("places = ", places);

//             document.getElementById("results").innerHTML =
//               "<code>" + JSON.stringify(places) + "</code>";
//           }
//         }
//         me.directionsDisplay.setDirections(response);
//         console.log("me:   ", me);
//       } else {
//         window.alert("Directions request failed due to " + status);
//       }
//     }
//   );
// };
