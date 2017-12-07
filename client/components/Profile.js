import React, {Component} from 'react';
import { connect } from 'react-redux';
import { fetchPlaces, createPlaceName, createAddress, addPlace, deleteUserPlace } from '../store';
import { Redirect } from 'react-router-dom';
// import * as _ from 'lodash';
import axios from 'axios';
// import {daysInMonth} from '../../utils';
import store, { loadUser } from "../store";
// import Autocomplete from "./Autocomplete"
import AutocompleteWrapper from './AutocompleteWrapper';




class Profile extends Component {
    constructor(props){
        super();

        // this.handleSubmit = this.handleSubmit.bind(this);
        // this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(e, userId){
      e.preventDefault()
      

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

          			<div className="col-6">

                  <h4 className="lead">Add New Address</h4>

                    <div>
                      <AutocompleteWrapper/>
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



const mapState = (state) => {
  return {
    user: state.user,
    places: state.place,
    // newPlaceName: state.newPlaceName,
    // newAddress: state.newAddress
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

