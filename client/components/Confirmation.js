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
import moment from 'moment-timezone';

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
    let displayStartTime = moment(currentMeetup.time).tz('America/New_York').format("YYYY/MM/DD HH:mm-ssZ").split(/-|\+/)[0];

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
    let convertedStartTime = moment(currentMeetup.time).tz('America/New_York').format("YYYYMMDDTHHmmssZ").split(/-|\+/)[0];
    let convertedEndTime = moment(currentMeetup.time).tz('America/New_York').add(1, 'hours').format("YYYYMMDDTHHmmssZ").split(/-|\+/)[0];
    let displayStartTime = moment(currentMeetup.time).tz('America/New_York').format("YYYY/MM/DD HH:mm-ssZ").split(/-|\+/)[0]

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
                <p className="card-text"><strong>Meeting with: </strong>{friend.name}</p>
                <p className="card-text"><strong>Time: </strong>{displayStartTime}</p>


              </div>
            </div>

          </div>

          <div className="col-6">
            <div className='card confirmation-card2'>
              <h2>{currentMeetup.place.name}</h2>
              <div>
                <CalendarButton type="google" start={convertedStartTime} end={convertedEndTime} title={'Rendezvous'} location={currentMeetup.place.name}/>
                <CalendarButton type="mac" start={convertedStartTime} end={convertedEndTime} title={'Rendezvous'} location={currentMeetup.place.name}/>
              </div>
              
            </div>
            
              

          </div>

        </div>
            
            <br />

            <div  className='row'>
            <div  className='col-12'>
              <MapContainer/>
            </div>
            </div>
          </div>
        );
    }

    // At this point, the meetup doesn't a place ID, thus it's not accepted yet.
    // So if the user is the initiator, then we don't allow origin change.
    if (initiator.userId === user.id && initiator.status === 'initiated') {
      return (
               <div>
                  <div className="row">
                  
                    <div className="col-6">
                      <div className="card confirmation-card">
                        <div className="card-body">
                          <p className="card-text"><strong>Pending: </strong>{friend.name}</p>
                          <p className="card-text"><strong>Time: </strong>{displayStartTime}</p>
                          <p className="card-text"><small className="text-muted"> awaiting response </small></p>
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
                <p className="card-text"><strong>Friend: </strong>{friend.name}</p>
                <p className="card-text"><strong>Time: </strong>{displayStartTime}</p>

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
                
                { venue.name && <h2>{venue.name}</h2>}
                { venue.name && (<button className="btn btn-success" onClick={handleClick}>
                  <i className="fa fa-thumbs-o-up" />      Let's meet! 
                </button>)}

              </form>


          </div>

        </div>
        
        

        <br />
        
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
