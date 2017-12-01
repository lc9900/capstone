import React, {Component} from 'react';
import { connect } from 'react-redux';
import { fetchPlaces, createPlaceName, createAddress, addPlace } from '../store';
import { Redirect } from 'react-router-dom';
// import * as _ from 'lodash';
import axios from 'axios';
// import {daysInMonth} from '../../utils';

class Profile extends Component {
    constructor(props){
        super();
        this.state = {

        };
        // this.handleSubmit = this.handleSubmit.bind(this);
        // this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event) {
    }

    handleChange(event) {
    }
    
    componentDidMount(props){
      const { getAllPlaces } = this.props;
      getAllPlaces()
    }
    
    // user's place comes on the user object
    // getAddress(placeId){
    //   const grepArr = $.grep(this.props.places, function(elem){ return elem.id === placeId})
    //   return grepArr[0]['address']
    // }

    render(){
        const {user, places} = this.props;
        const userPlaces = user.places
        console.log('places',places)
        console.log('user',user)
        console.log('userPlaces',userPlaces)

        return (
          <div>
          	<div className="container-fluid">
          		<div className="row">
          			
          			<div className="col-12">
          				
                  <h2>Add a new address</h2>

                    <div>
                      <form id="new-address-form" onSubmit={this.props.handleSubmit}>
                        <div className="input-group">
                          <input className="form-control nickname-form" type="text" name="newPlaceName" value={this.props.newPlaceName} placeholder="nickname" onChange={this.props.handlePlaceNameChange} />
                          <input className="form-control address-form" type="text" name="newAddress" value={this.props.newAddress} placeholder="address" onChange={this.props.handleAddressChange} />
                          <span className="input-group-btn">
                            <button className="btn" type="submit">Submit</button>
                          </span>
                        </div>
                      </form>
                    </div>   
                             
                  <hr/>

                  <h2>Your addresses</h2>
                  {userPlaces ? userPlaces.map(place=>{
                    return(<div key={`${place.id}`}>
                        <div>id: {place.id}</div>
                        <div>address: {place.address}</div>
                        <div>(good to have) on click display on map?</div>
                        <hr/>
                      </div>)
                  }):<div></div>}
                  <h2>Map somewhere?</h2>

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
    handleSubmit: function(e){
      e.preventDefault()
      dispatch(addPlace({address: e.target.newAddress.value, name: e.target.newPlaceName.value}))
      dispatch(createAddress(''))
      dispatch(createPlaceName(''))
    }
  };
};

export default connect(mapState, mapDispatch)(Profile);

