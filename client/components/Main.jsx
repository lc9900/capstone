import React, { Component } from "react";
import { connect } from "react-redux";
// import {fetchProducts} from '../store.js'
import {Route, NavLink, withRouter, Switch, Redirect} from 'react-router-dom';

import Login from "./Login";
import Nav from "./Nav";
import NewProposal from "./NewProposal";
import { verifyUser, loadUser } from '../reducers';

class Main extends Component {
  constructor() {
    super();
  }

    componentDidMount() {
    const { loginUser, loadSessionUser } = this.props;
    return loadSessionUser()
          .catch(err => {
            console.log('error occurred ', err.response.data);
            throw err;
          });
  }

  render() {
    return (
      <div>
        <div className="container">
          <Nav />
          <Switch>
              <Route path='/newproposal' component={NewProposal} />
              <Route path='/login' component={Login}/>
              <Redirect to='/Login' />
          </Switch>
        </div>
      </div>
    );
  }
}

// export default Main  // This is only commented out to set default user

// The following container is needed only to set default user
/* -----------------    CONTAINER     ------------------ */

const mapState = ({user}) => {
  return {
    user
  };
};

const mapDispatch = (dispatch) => {
  return {
    loginUser: function(credential){
      return dispatch(verifyUser(credential));
    },
    loadSessionUser: function(){
      return dispatch(loadUser());
    }
  };
};

export default withRouter(connect(mapState, mapDispatch)(Main));
