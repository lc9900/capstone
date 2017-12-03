import React, {Component} from 'react';
import { connect } from 'react-redux';
import { fetchPlaces, createPlaceName, createAddress, addPlace, deleteUserPlace } from '../store';
import { Redirect } from 'react-router-dom';
// import * as _ from 'lodash';
import axios from 'axios';
// import {daysInMonth} from '../../utils';
import store, { loadUser } from "../store";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'


class Profile extends Component {
    constructor(props){
        super();

        this.state = { address: '' }
        this.onChange = (address) => this.setState({ address })
        // this.handleSubmit = this.handleSubmit.bind(this);
        // this.handleChange = this.handleChange.bind(this);
    }

    // handleSubmit(event) {
    // }

    handleSubmit(e, userId){
      e.preventDefault()
      geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error))

      store.dispatch(addPlace({address: e.target.newAddress.value, name: e.target.newPlaceName.value}, userId))
      .then(()=>store.dispatch(createAddress('')))
      .then(()=>store.dispatch(createPlaceName('')))
      .then(()=>this.props.loadSessionUser())
      .catch(err=>{throw err})

    }

    handleDelete(e, userId, placeId){
      e.preventDefault()
      store.dispatch(deleteUserPlace(userId, placeId))
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


          const inputProps = {
            value: this.state.address,
            onChange: this.onChange,
            name: 'newAddress'
          }

          const autoCompleteClass = {
            root: 'form-control address-form',
            input: 'newAddressInput'
          }

        return (
          <div>
          	<div className="container-fluid">
          		
              <div className="row">

          			<div className="col-6">

                  <h4 className="lead">Add New Address</h4>

                    <div>
                      <form id="new-address-form" onSubmit={e => {this.handleSubmit(e, user.id)}}>

                          <div className="row address-form-row">
                            <div className="col-2">
                              <label htmlFor="newPlaceName"> Name </label>
                            </div>
                            <div className="col-10">
                              <input className="form-control nickname-form" type="text" name="newPlaceName" value={newPlaceName} placeholder="" onChange={handlePlaceNameChange} />
                            </div>
                          </div>
                          <div className="row address-form-row">
                            <div className="col-2">
                              <label htmlFor="newAddress"> Address </label>
                            </div>
                            <div className="col-10">
                              <PlacesAutocomplete inputProps={inputProps} classNames={autoCompleteClass} name="newAddress" value={newAddress} onChange={handleAddressChange}/>
                              
                            </div>
                          </div>
                          
                            
                              <button className="btn btn-primary address-btn" type="submit">Submit</button>
                          <br />  
                          <br />  
                          
                        
                      </form>
                    </div>

                  
                </div>
                <div className= "col-6">
                  <h4 className="lead">Saved Addresses</h4>
                  {userPlaces ? userPlaces.map(place=>{
                    return(<div key={`${place.id}`}>
                        <div className="row">
                          
                          <div className="col-10">
                            <div>Name: {place.name}</div>
                            <div>Address: {place.address}</div>
                          </div>
                          
                          <div className="col-2">
                            <form onSubmit={e => this.handleDelete(e, user.id, place.id)}>
                              <button className="btn btn-danger" type="submit">x</button>
                            </form>
                          </div>

                        </div>

                        <hr />
                      </div>
                    )
                  }):<div></div>}


          			</div>

          		</div>
          	</div>
        </div>
        )
    }
}

//////////////////////////////////////////////////////

// <input className="form-control address-form" type="text" name="newAddress" value={newAddress} placeholder="address" onChange={handleAddressChange} />


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

