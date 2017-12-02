//I think I'm not using this afterall
import axios from 'axios';

//Action Types
const GET_PLACES = 'GET_PLACES';
const POST_PLACE = 'POST_PLACE';

//Action Creators
export const getPlaces = (places) => {
  return {
    type: GET_PLACES,
    places
  }
};

export const postPlace = (place) => {
  return{
    type: POST_PLACE,
    place
  }
};

//Thunk Creators
//this puts all places in store
export function fetchPlaces(){
  return function thunk(dispatch){
	return axios.get(`/api/place`)
	.then(res => {
		return res.data
	})

	.then(result => {
		const action = getPlaces(result)
		dispatch(action)
	})
  }
};

export function addPlace(placeObj, userId){
  console.log('user id in addPlace?', userId)
  return function thunk(dispatch){
    let newPlaceObject
    return axios.post(`/api/place`, placeObj) //adds new place to place model
    .then(res => {return newPlaceObject = res.data})
    .then(result => {
      return axios.get(`/api/user/${userId}`)
    })
    .then(res => res.data)
    .then(user => user.addPlace(newPlaceObject))
    
    .then(result => {
      const action = postPlace(newPlaceObject)
      dispatch(action)
    })
  }
}

		

//UserMeetup Reducer
const PlaceReducer = function(state = [], action) {
  switch (action.type) {
    case GET_PLACES : 
      return action.places
    case POST_PLACE:
      return [...state, action.address]
    default:
      return state;
  }
};

export default PlaceReducer;
