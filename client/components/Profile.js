import React, {Component} from 'react';
import { connect } from 'react-redux';
import { fetchPlaces, createPlaceName, createAddress, addPlace } from '../store';
import { Redirect } from 'react-router-dom';
// import * as _ from 'lodash';
import axios from 'axios';
// import {daysInMonth} from '../../utils';
import store, { loadUser } from "../store";

class Profile extends Component {
    constructor(props){
        super();
        this.state = {

        };
        // this.handleSubmit = this.handleSubmit.bind(this);
        // this.handleChange = this.handleChange.bind(this);
    }

    // handleSubmit(event) {
    // }

    handleSubmit(e, userId){
      e.preventDefault()
      store.dispatch(addPlace({address: e.target.newAddress.value, name: e.target.newPlaceName.value}, userId))
      .then(()=>store.dispatch(createAddress('')))
      .then(()=>store.dispatch(createPlaceName('')))
      .then(()=>this.props.loadSessionUser())
      .catch(err=>{throw err})
    }

    // handleChange(event) {
    // }

    componentDidMount(props){
      const { getAllPlaces, loadSessionUser } = this.props;
      getAllPlaces();
      loadSessionUser();
    }

    // user's place comes on the user object

    render(){
        const {user, places, handlePlaceNameChange, handleAddressChange, newPlaceName, newAddress} = this.props;
        const userPlaces = user.places
        console.log('places',places)
        console.log('user',user)
        console.log('userPlaces',userPlaces)

        if(! user.id) return <Redirect to='/Login' />

        return (
          <div>
          	<div className="card profile">
          		<div className="row">

          			<div className="col-12">

                  <h2>Add a new address</h2>

                    <div>
                      <form id="new-address-form" onSubmit={e => {this.handleSubmit(e, user.id)}}>
                        <div className="input-group">
                          <input className="form-control nickname-form" type="text" name="newPlaceName" value={newPlaceName} placeholder="nickname" onChange={handlePlaceNameChange} />
                          <input className="form-control address-form" type="text" name="newAddress" value={newAddress} placeholder="address" onChange={handleAddressChange} />
                          <span className="input-group-btn">
                            <button className="btn btn-primary" type="submit">Submit</button>
                          </span>
                        </div>
                      </form>
                    </div>

                  <hr/>

                  <h2>Your addresses</h2>
                  {userPlaces ? userPlaces.map(place=>{
                    return(<div key={`${place.id}`}>
                        <div>Name: {place.name}</div>
                        <div>Address: {place.address}</div>
                        <div>place id: {place.id}</div>
                        <hr/>
                      </div>)
                  }):<div></div>}


          			</div>

          		</div>
          	</div>
        </div>
        )
    }
}

//////////////////////////////////////////////////////



const mapState = (state) => {
  return {
    user: state.user,
    places: state.place,
    newPlaceName: state.newPlaceName,
    newAddress: state.newAddress
  }
}
const mapDispatch = (dispatch) => {
  return {
    getAllPlaces: function(){
      return dispatch(fetchPlaces())
    },
    handleAddressChange: function(e){
      dispatch(createAddress(e.target.value))
    },
    handlePlaceNameChange: function(e){
      dispatch(createPlaceName(e.target.value))
    },
    loadSessionUser: () => dispatch(loadUser())
  };
};

export default connect(mapState, mapDispatch)(Profile);

