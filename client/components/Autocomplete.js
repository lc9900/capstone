import React, {Component} from 'react';
import { connect } from 'react-redux';
import { fetchPlaces, createPlaceName, createAddress, addPlace, deleteUserPlace } from '../store';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import store, { loadUser } from "../store";

class Autocomplete extends Component {
  constructor(props) {
    super(props)
    this.state = { address: '' }
    this.onChange = (address) => this.setState({ address })
  }

  handleFormSubmit = (event) => {
    event.preventDefault()

    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error))

    store.dispatch(addPlace({address: e.target.newAddress.value, name: e.target.newPlaceName.value}, userId))
      .then(()=>store.dispatch(createAddress('')))
      .then(()=>store.dispatch(createPlaceName('')))
      .then(()=>this.props.loadSessionUser())
      .catch(err=>{throw err})

      this.setState({address:''})
  }

  render() {

    const {user, places, handlePlaceNameChange, handleAddressChange, newPlaceName, newAddress} = this.props;

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
    )
  }
}

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

export default connect(mapState, mapDispatch)(Autocomplete);
