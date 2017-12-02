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
import store, {fetchVenue, loadUser} from "../store";
import axios from 'axios';
import CalendarButton from './CalendarButton';
import moment from 'moment';

class Confirmation extends Component {
  constructor() {
    super();

    this.state = {
      userLocationId: "",
      showMap: false,
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
    const userLocationId = e.target.value;
    const places = this.props.place;
    const initiator = this.props.confirmation.meetup_user_statuses.find(
      user => user.initiator
    );
    const initiatorLocation = places.find(
      place => place.id === initiator.originId
    );
    const userLocation = places.find(
      place => place.id === Number(userLocationId)
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
    )
    .then(() => {
      return store.dispatch(fetchVenue(this.calculateMid(initiatorLocation, userLocation)));
    })
    .then(() => {
      this.setState({ showMap: true, userLocationId });
    })
    .catch(err => { throw err; });
  }

  handleClick(e) {
    e.preventDefault();

    const {venue, user, confirmation, friend} = this.props;
    const {userLocationId} = this.state;
    const meetupId = Number(this.props.match.params.id);
    const currentMeetup = user.meetups.find(meetup => meetup.id === meetupId);
    let displayStartTime = moment(currentMeetup.time).format("YYYY/MM/DD HH:mm-ssZ").split(/-|\+/)[0];

    let content = {
      googleId: venue.googleId,
      status: 'accepted',
      originId: userLocationId,
      userId: user.id,
      name: venue.name,
      address: venue.address,
      lat: venue.lat,
      lng: venue.lng,
      user: {name: user.name, phone: user.phone},
      friend: {name: friend.name, phone: friend.phone},
      startTime: displayStartTime
    };

    axios.put(`/api/meetup/${confirmation.id}`, content)
        .then(() => {
          store.dispatch(loadUser());
        })
        .catch(err => { throw err; });
  }

  render() {
    if (!this.props || !this.props.friend) {
      return <div>Loading...</div>;
    }

    console.log("props", this.props);

    const meetupId = Number(this.props.match.params.id);
    const { user, confirmation, friend, venue } = this.props;
    const { handleChange, handleClick } = this;
    const currentMeetup = user.meetups.find(meetup => meetup.id === meetupId);

    // Sample time output -- it's actually a string -- 2017-12-01T04:00:00.000Z
    let convertedStartTime = moment(currentMeetup.time).format("YYYYMMDDTHHmmssZ").split(/-|\+/)[0];
    let convertedEndTime = moment(currentMeetup.time).add(1, 'hours').format("YYYYMMDDTHHmmssZ").split(/-|\+/)[0];
    let displayStartTime = moment(currentMeetup.time).format("YYYY/MM/DD HH:mm-ssZ").split(/-|\+/)[0]

    const initiator = this.props.confirmation.meetup_user_statuses.find(
      user => user.initiator
    );

    if (currentMeetup.placeId) {
      return (
          <div>
            <h1>{`Accepted Rendezvous for ${meetupId}`}</h1>
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
                <p className="card-text">{displayStartTime}</p>
              </div>
            </div>
            <br />
            <h2>{currentMeetup.place.name}</h2>
            <CalendarButton type="google" start={convertedStartTime} end={convertedEndTime} title={'Rendezvous'} location={currentMeetup.place.name}/>
            <br/>
            <br/>
            <CalendarButton type="mac" start={convertedStartTime} end={convertedEndTime} title={'Rendezvous'} location={currentMeetup.place.name}/>
            <MapContainer/>
          </div>
        );
    }

    return (
      <div>
        <h1>{`Confirmation for ${meetupId}`}</h1>
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
            <p className="card-text">{displayStartTime}</p>
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
          { venue.name && <h2>{venue.name}</h2>}
          { venue.name && (<button className="btn btn-secondary" onClick={handleClick}>
            Accept Meeting
          </button>)}

        </form>
        {this.state.showMap && <MapContainer />}
      </div>
    );
  }
}

const mapState = ({ user, confirmation, place, venue }) => {
  return {
    user,
    confirmation,
    place,
    venue,
    friend: confirmation.users
      ? confirmation.users.find(u => u.id !== user.id)
      : null
  };
};

export default connect(mapState)(Confirmation);
