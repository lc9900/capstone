import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchMeetup } from "../reducers/confirmation";
import { fetchPlaces } from "../reducers/place";
import {
  setUserStart,
  setFriendStart,
  fetchMeetingDestination,
  setMeetingDestination
} from "../reducers/map";
import MapContainer from "./MapContainer";
import store, { fetchVenue, loadUser } from "../store";
import axios from "axios";
import CalendarButton from "./CalendarButton";
import moment from "moment-timezone";
import { Redirect } from "react-router-dom";

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
    this.setLocations = this.setLocations.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    store.dispatch(fetchMeetup(match.params.id)).then(() => {
      store.dispatch(fetchPlaces()).then(res => {
        const { confirmation, user } = this.props;
        const userMeetup = confirmation.meetup_user_statuses.find(
          meetup => !meetup.initiator
        );

        if (userMeetup.status === "accepted") {
          this.setLocations(userMeetup.originId);
          const meetupDestination = user.meetups.find(
            meetup => meetup.id === confirmation.id
          ).place;

          store.dispatch(
            setMeetingDestination({
              lat: meetupDestination.lat,
              lng: meetupDestination.lng
            })
          );
        }
      });
    });
  }

  calculateMid(loc1, loc2) {
    return { lat: (loc1.lat + loc2.lat) / 2, lng: (loc1.lng + loc2.lng) / 2 };
  }

  setLocations(uId) {
    //get locations
    const { places, confirmation } = this.props;
    const initiator = confirmation.meetup_user_statuses.find(
      user => user.initiator
    );
    const initiatorLocation = places.find(
      place => place.id === initiator.originId
    );
    const userLocation = places.find(place => place.id === uId);

    //update store
    store.dispatch(
      setUserStart({ lat: userLocation.lat, lng: userLocation.lng })
    );

    store.dispatch(
      setFriendStart({ lat: initiatorLocation.lat, lng: initiatorLocation.lng })
    );

    return { initiatorLocation, userLocation };
  }

  handleChange(e) {
    const userLocationId = Number(e.target.value);
    const { setLocations, calculateMid } = this;
    const { initiatorLocation, userLocation } = setLocations(userLocationId);
    const mid = calculateMid(initiatorLocation, userLocation);

    store
      .dispatch(fetchMeetingDestination(mid))
      .then(() => {
        return store.dispatch(fetchVenue(mid));
      })
      .then(() => {
        this.setState({ showMap: true, userLocationId });
      })
      .catch(err => {
        throw err;
      });
  }

  handleClick(e) {
    e.preventDefault();

    const { venue, user, confirmation, friend } = this.props;
    const { userLocationId } = this.state;
    const meetupId = Number(this.props.match.params.id);
    const currentMeetup = user.meetups.find(meetup => meetup.id === meetupId);
    const displayStartTime = moment(currentMeetup.time)
      .tz("America/New_York")
      .format("YYYY/MM/DD HH:mm-ssZ")
      .split(/-|\+/)[0];

    const content = {
      googleId: venue.googleId,
      status: "accepted",
      originId: userLocationId,
      userId: user.id,
      name: venue.name,
      address: venue.address,
      lat: venue.lat,
      lng: venue.lng,
      user: { name: user.name, phone: user.phone },
      friend: { name: friend.name, phone: friend.phone },
      startTime: displayStartTime
    };

    axios
      .put(`/api/meetup/${confirmation.id}`, content)
      .then(() => {
        store.dispatch(loadUser());
      })
      .catch(err => {
        throw err;
      });
  }

  render() {
    if (!this.props || !this.props.friend) {
      return <div>Loading...</div>;
    }

    const { user, confirmation, friend, venue } = this.props;
    if (!user.id) return <Redirect to="/Login" />;

    const meetupId = Number(this.props.match.params.id);
    const { handleChange, handleClick } = this;
    const currentMeetup = user.meetups.find(meetup => meetup.id === meetupId);

    // Sample time output -- it's actually a string -- 2017-12-01T04:00:00.000Z
    let convertedStartTime = moment(currentMeetup.time)
      .tz("America/New_York")
      .format("YYYYMMDDTHHmmssZ")
      .split(/-|\+/)[0];
    let convertedEndTime = moment(currentMeetup.time)
      .tz("America/New_York")
      .add(1, "hours")
      .format("YYYYMMDDTHHmmssZ")
      .split(/-|\+/)[0];
    let displayStartTime = moment(currentMeetup.time)
      .tz("America/New_York")
      .format("YYYY/MM/DD HH:mm-ssZ")
      .split(/-|\+/)[0];

    const initiator = this.props.confirmation.meetup_user_statuses.find(
      user => user.initiator
    );

    if (currentMeetup.placeId) {
      return (
        <div>
          <div className="row">
            <div className="col-6">
              <div className="card confirmation-card">
                <div className="card-body">
                  <p className="card-text">
                    <strong>Meeting with: </strong>
                    {friend.name}
                  </p>
                  <p className="card-text">
                    <strong>Time: </strong>
                    {displayStartTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-6">
              <h2>{currentMeetup.place.name}</h2>
              <h4>{currentMeetup.place.address}</h4>
              <CalendarButton
                type="google"
                start={convertedStartTime}
                end={convertedEndTime}
                title={"Rendezvous"}
                location={currentMeetup.place.name}
              />
              <CalendarButton
                type="mac"
                start={convertedStartTime}
                end={convertedEndTime}
                title={"Rendezvous"}
                location={currentMeetup.place.name}
              />
            </div>
          </div>

          <br />

          <MapContainer />
        </div>
      );
    }

    // At this point, the meetup doesn't a place ID, thus it's not accepted yet.
    // So if the user is the initiator, then we don't allow origin change.
    if (initiator.userId === user.id && initiator.status === "initiated") {
      return (
        <div>
          <div className="row">
            <div className="col-6">
              <div className="card confirmation-card">
                <div className="card-body">
                  <p className="card-text">
                    <strong>Pending: </strong>
                    {friend.name}
                  </p>
                  <p className="card-text">
                    <strong>Time: </strong>
                    {displayStartTime}
                  </p>
                  <p className="card-text">
                    <small className="text-muted"> awaiting response </small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="row">
          <div className="col-6">
            <div className="card confirmation-card">
              <div className="card-body">
                <p className="card-text">
                  <strong>Friend: </strong>
                  {friend.name}
                </p>
                <p className="card-text">
                  <strong>Time: </strong>
                  {displayStartTime}
                </p>

                <form>
                  <div className="form-group place-dropdown">
                    <select
                      className="form-control "
                      id="selectAddress"
                      onChange={handleChange}
                      value={this.state.userLocationId}
                    >
                      <option value="">Select Your Point of Origin</option>
                      {user.places.map(place => (
                        <option key={place.id} value={place.id}>
                          {place.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-6">
            <form className="recommendation-form">
              {venue.name && <h2>{venue.name}</h2>}
              {venue.name && <h4>{venue.address}</h4>}
              {venue.name && (
                <button className="btn btn-success" onClick={handleClick}>
                  <i className="fa fa-thumbs-o-up" /> Let's meet!
                </button>
              )}
            </form>
          </div>
        </div>

        <br />

        {this.state.showMap && <MapContainer />}
      </div>
    );
  }
}

const mapState = ({ user, confirmation, place, venue, map }) => {
  return {
    user,
    confirmation,
    places: place,
    venue,
    map,
    friend: confirmation.users
      ? confirmation.users.find(u => u.id !== user.id)
      : null
  };
};

export default connect(mapState)(Confirmation);
