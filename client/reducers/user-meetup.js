//I think I'm not using this afterall
import axios from 'axios';

//Action Types
const GET_MEETUPS = 'GET_MEETUPS';

//Action Creators
export const getMeetups = (meetups) => {
  return {
    type: GET_MEETUPS,
    meetups
  }
};

//Thunk Creators
export function fetchMeetups(userId){
  return function thunk(dispatch){
    const meetupIdArray=[]
    const meetupIncludeUserArray=[]
	return axios.get(`/api/user/${userId}/meetups`)
	.then(res => {
		return res.data
	})
	.then(meetupObjArray => {
		meetupObjArray.forEach(i => {
			meetupIdArray.push(i['id'])
		})
	})
	.then(result => {
        return meetupIdArray.forEach(meetupId => {
        	axios.get(`/api/meetup/${meetupId}/includeUser`)
        	.then(res => meetupIncludeUserArray.push(res.data[0]))
        	.then(result => {
				const action = getMeetups(meetupIncludeUserArray)
				dispatch(action)
			})
        })
	})
  }
}
		

//UserMeetup Reducer
const UserMeetupReducer = function(state = [], action) {
  switch (action.type) {
    case GET_MEETUPS : return action.meetups
    default:
      return state;
  }
};

export default UserMeetupReducer;
