import React, { Component } from "react";
import { connect } from "react-redux";
import store from "../store";

class Confirmation extends Component {
  constructor() {
    super();
  }

  render() {
    if (!this.props) {
      return <div>Loading...</div>;
    }

    const meetupId = Number(this.props.match.params.id);
    const { user } = this.props;
    console.log("user", user);

    const meetup = user.meetups.find(meetup => meetup.id === meetupId);
    console.log("meetup", meetup);

    return (
      <div>
        <h1>{`Confirmation Screen for ${meetupId}`}</h1>

        <form>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Friend</label>
            <div className="col-sm-10">
              <p className="form-control-static">Bobby</p>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Time</label>
            <div className="col-sm-10">
              <p className="form-control-static">{meetup.time}</p>
            </div>
          </div>
          <div className="form-group">
            <label>Select Address</label>
            <select className="form-control" id="selectAddress">
              {user.places.map(place => (
                <option key={place.id}>{place.name}</option>
              ))}
            </select>
          </div>
        </form>
      </div>
    );
  }
}

const mapState = ({ user }) => {
  return { user };
};

const mapDispatch = dispatch => {
  return {};
};

export default connect(mapState, mapDispatch)(Confirmation);
