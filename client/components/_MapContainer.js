import React, { Component } from "react";
import { connect } from "react-redux";
import { GoogleApiWrapper } from "google-maps-react";
import Gmap from "./Gmap";

export class MapContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.loaded) {
      return <div>Loading...</div>;
    }

    const { google } = this.props;
    const style = {
      width: "100vw",
      height: "100vh"
    };

    return (
      <div style={style}>
        <h1>MapContainer</h1>
        <Gmap google={google} />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAopJDwUG1vlrsZg94qP6yuPtzapUgYw8g"
})(MapContainer);
