import React, {Component} from 'react';
import { connect } from 'react-redux';
import {  } from '../store';
import { Redirect } from 'react-router-dom';

class NewProposal extends Component {
    constructor(){
        super();
    }

    render(){
        const {user} = this.props;
        if(! user.id) return <Redirect to='/Login' />

        return (
            <div>
                <h1> New Proposal Page </h1>
            </div>
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
export default connect(mapState, mapDispatch)(NewProposal);
