import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchMeetup } from "../reducers/confirmation";
import { fetchPlaces } from "../reducers/place";
import {
  setUserStart,
  setFriendStart,
  fetchMeetingDestination
} from "../reducers/map";
import MapContainer from "./MapContainer";
import store from "../store";

class Confirmation extends Component {
  constructor() {
    super();

    this.state = {
      userLocationId: "",
      showMap: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.calculateMid = this.calculateMid.bind(this);
  }

  componentDidMount() {
    store.dispatch(fetchMeetup(this.props.match.params.id));
    store.dispatch(fetchPlaces());
  }

  calculateMid(loc1, loc2) {
    return { lat: (loc1.lat + loc2.lat) / 2, lng: (loc1.lng + loc2.lng) / 2 };
  }

  handleChange(e) {
    this.setState({ userLocationId: e.target.value });
  }

  handleClick(e) {
    e.preventDefault();

    const places = this.props.place;
    const initiator = this.props.confirmation.meetup_user_statuses.find(
      user => user.initiator
    );
    const initiatorLocation = places.find(
      place => place.id === initiator.originId
    );
    const userLocation = places.find(
      place => place.id === Number(this.state.userLocationId)
    );

    //update store
    store.dispatch(
      setUserStart({ lat: userLocation.lat, lng: userLocation.lng })
    );
    store.dispatch(
      setFriendStart({ lat: initiatorLocation.lat, lng: initiatorLocation.lng })
    );
    store.dispatch(
      fetchMeetingDestination(
        this.calculateMid(initiatorLocation, userLocation)
      )
    );

    this.setState({ showMap: true });
  }

  render() {
    if (!this.props || !this.props.friend) {
      return <div>Loading...</div>;
    }

    console.log("props", this.props);

    const meetupId = Number(this.props.match.params.id);
    const { user, confirmation, friend } = this.props;
    const { handleChange, handleClick } = this;
    const currentMeetup = user.meetups.find(meetup => meetup.id === meetupId);

    return (
      <div>
        <h1>{`Confirmation Screen for ${meetupId}`}</h1>
        <br />
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Friend</h4>
            <p className="card-text">{friend.name}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Time</h4>
            <p className="card-text">{currentMeetup.time}</p>
          </div>
        </div>
        <br />
        <form>
          <div className="form-group">
            <label>Select Your Point of Origin</label>
            <select
              className="form-control"
              id="selectAddress"
              onChange={handleChange}
              value={this.state.userLocationId}
            >
              <option value="">-- Select --</option>
              {user.places.map(place => (
                <option key={place.id} value={place.id}>
                  {place.name}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-secondary" onClick={handleClick}>
            Accept Meeting
          </button>
        </form>
        {this.state.showMap && <MapContainer />}
      </div>
    );
  }
}

const mapState = ({ user, confirmation, place }) => {
  return {
    user,
    confirmation,
    place,
    friend: confirmation.users
      ? confirmation.users.find(u => u.id !== user.id)
      : null
  };
};

export default connect(mapState)(Confirmation);
