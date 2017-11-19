import React, {Component} from 'react';
import { connect } from 'react-redux';
import {  } from '../store';
import { Redirect } from 'react-router-dom';

class NewMeetup extends Component {
    constructor(){
        super();
        let now = new Date();
        this.state = {
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          date: now.getDate(),


        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit() {

    }

    handleChange(event) {

    }

    render(){
        const {user} = this.props;
        if(! user.id) return <Redirect to='/Login' />

        return (
            <form on>
              <div className="form-group">
                <label for="exampleInputEmail1">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
              </div>
              <div className="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"/>
              </div>
              <div className="form-check">
                <label className="form-check-label">
                  <input type="checkbox" className="form-check-input"/>
                  Check me out
                </label>
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        )
    }
}


//////////////////////////////////////////////////////

const mapState = (state) => {
  return {
    user: state.user
  }
}
const mapDispatch = (dispatch) => {
  return {
  //   loginUser: function(credential){
  //     return dispatch(verifyUser(credential));
  //   },

  //   logoutUser: function(){
  //     dispatch(logout())
  //       },

  //       getCart : function(id){
  //           return dispatch(fetchCart(id))
  //       }
  };
};

// export default connect(mapState, mapDispatch)(Login);
export default connect(mapState, mapDispatch)(NewMeetup);
