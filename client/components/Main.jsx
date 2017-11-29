import React, { Component } from "react";
import { connect } from "react-redux";
// import {fetchProducts} from '../store.js'
import { Route, NavLink, withRouter, Switch, Redirect } from "react-router-dom";

import Login from "./Login";
import Nav from "./Nav";
import MapContainer from "./MapContainer";
import NewMeetup from "./NewMeetup";
import Confirmation from "./Confirmation";
import Test from "./Test";
import { displayMain, loadUser, logout } from "../store";

class Main extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    // const { loginUser, loadSessionUser } = this.props;
    const { loadSessionUser, setDisplayMain } = this.props;
    return loadSessionUser()
      .then(() => {
        // Display flag is only useful on first page load, or refresh.
        // It prevents any data from showing until loadSessionUser is completed.
        // loadSessionUser makes an axios call, thus timing can cause
        // unwanted data from display.
        setDisplayMain(true);
      })
      .catch(err => {
        console.log("error occurred ", err.response.data);
        throw err;
      });
  }

  render() {
    const { user, display } = this.props;
    if (!display) return <div />;

    return (
      <div>
        <div className="container">
          <Nav />
          <Switch>
            <Route path="/map" component={MapContainer} />
            <Route path="/meetup" component={NewMeetup} />
            <Route path="/login" component={Login} />
            <Route path="/test" component={Test} />
            <Route path="/confirmation/:id" component={Confirmation} />
            {/*<Redirect to="/Login" />*/}
          </Switch>
        </div>
      </div>
    );
  }
}

// export default Main  // This is only commented out to set default user

// The following container is needed only to set default user
/* -----------------    CONTAINER     ------------------ */

const mapState = ({ user, display }) => {
  return {
    user,
    display
  };
};

const mapDispatch = dispatch => {
  return {
    loadSessionUser: () => dispatch(loadUser()),
    setDisplayMain: flag => dispatch(displayMain(flag)),
    logoutUser: () => {
      dispatch(logout())
        // .then(() => {
        // })
        .catch(err => {
          throw err;
        });
    }
  };
};

export default withRouter(connect(mapState, mapDispatch)(Main));
