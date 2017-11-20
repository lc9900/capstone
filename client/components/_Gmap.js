import React, { Component } from "react";
import { connect } from "react-redux";
import { GoogleApiWrapper } from "google-maps-react";
import ReactDOM from "react-dom";

export default class Gmap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 15,
      center: {
        lat: 40.705312,
        lng: -74.009197
      }
    };
    // this.recenterMap = this.recenterMap.bind(this);
    this.loadMap = this.loadMap.bind(this);
  }

  componentDidMount() {
    this.loadMap();

    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const coords = pos.coords;
        this.setState({
          center: {
            lat: coords.latitude,
            lng: coords.longitude
          }
        });
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }

    // if (prevState.center !== this.state.center) {
    //   this.recenterMap();
    // }
  }

  loadMap() {
    if (this.props && this.props.google) {
      // google is available
      const maps = this.props.google.maps;
      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      const { zoom, center } = this.state;
      const newCenter = new maps.LatLng(center.lat, center.lng);

      this.map = new maps.Map(node, {
        center: newCenter,
        zoom: zoom,
        styles: { height: "100%", width: "100%" }
      });
      console.log("this.map", this.map);
    }
  }

  // recenterMap() {
  //   const map = this.map;
  //   const curr = this.state.center;
  //   const maps = this.props.google.maps;

  //   if (map) {
  //     const newCenter = new maps.LatLng(curr.lat, curr.lng);
  //     map.panTo(newCenter);
  //   }
  // }

  render() {
    return (
      <div>
        <h1>Gmap</h1>
        <div ref="map">Loading map...</div>
      </div>
    );
  }
}
