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
    // store.dispatch(fetchExistingVenue(this.props.match.params.id * 1));
  }

  calculateMid(loc1, loc2) {
    return { lat: (loc1.lat + loc2.lat) / 2, lng: (loc1.lng + loc2.lng) / 2 };
  }

  handleChange(e) {
    // this.setState({ userLocationId: e.target.value });

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

    // this.setState({ showMap: true, userLocationId });
  }

  handleClick(e) {
    e.preventDefault();
    // {googleId, status, originId, userId, name, address, lat, lng}
    const {venue, user, confirmation} = this.props;
    const {userLocationId} = this.state;
    let content = {
      googleId: venue.googleId,
      status: 'accepted',
      originId: userLocationId,
      userId: user.id,
      name: venue.name,
      address: venue.address,
      lat: venue.lat,
      lng: venue.lng
    };

    console.log(content);
    console.log(confirmation.id);
    axios.put(`/api/meetup/${confirmation.id}`, content)
        .then(result => {
          // A hack to make the page refresh
          store.dispatch(loadUser());
        })
        .catch(err => { throw err; });

    // const places = this.props.place;
    // const initiator = this.props.confirmation.meetup_user_statuses.find(
    //   user => user.initiator
    // );
    // const initiatorLocation = places.find(
    //   place => place.id === initiator.originId
    // );
    // const userLocation = places.find(
    //   place => place.id === Number(this.state.userLocationId)
    // );

    // //update store
    // store.dispatch(
    //   setUserStart({ lat: userLocation.lat, lng: userLocation.lng })
    // );
    // store.dispatch(
    //   setFriendStart({ lat: initiatorLocation.lat, lng: initiatorLocation.lng })
    // );
    // store.dispatch(
    //   fetchMeetingDestination(
    //     this.calculateMid(initiatorLocation, userLocation)
    //   )
    // );

    // this.setState({ showMap: true });
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
    // console.log("time is: ", typeof currentMeetup.time)
    let convertedStartTime = moment(currentMeetup.time).format("YYYYMMDDTHHmmssZ").split(/-|\+/)[0];
    // console.log("new time is: ", convertedStartTime)

    let convertedEndTime = moment(currentMeetup.time).add(1, 'hours').format("YYYYMMDDTHHmmssZ").split(/-|\+/)[0];
    // console.log("end time is: ", convertedEndTime)
    let displayStartTime = moment(currentMeetup.time).format("YYYY/MM/DD HH:mm-ssZ").split(/-|\+/)[0]
    // console.log("display time is: ", displayStartTime)

    const initiator = this.props.confirmation.meetup_user_statuses.find(
      user => user.initiator
    );

    // if initiator's id is the same as current user's id, then don't allow changing of origin
    if(initiator.userId === user.id && initiator.status === 'initiated') {
      return (
          <div>
            <h1>{`Pending friend's response for ${meetupId}`}</h1>
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
          </div>
      );
    }

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
            {this.state.showMap && <MapContainer />}
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
