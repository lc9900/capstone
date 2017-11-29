import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchMeetup } from "../reducers/confirmation";
import store from "../store";

class Confirmation extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    store.dispatch(fetchMeetup(this.props.match.params.id));
  }

  render() {
    if (!this.props || !this.props.friend) {
      return <div>Loading...</div>;
    }

    console.log("props", this.props);

    const meetupId = Number(this.props.match.params.id);
    const { user, confirmation, friend } = this.props;
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
            <select className="form-control" id="selectAddress">
              {user.places.map(place => (
                <option key={place.id}>{place.name}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-secondary">Accept Meeting</button>
        </form>
      </div>
    );
  }
}

const mapState = ({ user, confirmation }) => {
  return {
    user,
    confirmation,
    friend: confirmation.users
      ? confirmation.users.find(u => u.id !== user.id)
      : null
  };
};

const mapDispatch = dispatch => {
  return { fetchMeetup };
};

export default connect(mapState, mapDispatch)(Confirmation);
