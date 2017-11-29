//I think I'm not using this afterall
import axios from 'axios';

//Action Types
const GET_PLACES = 'GET_PLACES';

//Action Creators
export const getPlaces = (places) => {
  return {
    type: GET_PLACES,
    places
  }
};

//Thunk Creators
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
}

		

//UserMeetup Reducer
const PlaceReducer = function(state = [], action) {
  switch (action.type) {
    case GET_PLACES : return action.places
    default:
      return state;
  }
};

export default PlaceReducer;
