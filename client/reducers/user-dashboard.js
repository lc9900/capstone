//I think I'm not using this afterall
import axios from 'axios';

//Action Types
const GET_USER_INFO = 'GET_USER_INFO';

//Action Creators
export const getUserInfo = (userInfo) => {
  return {
    type: GET_USER_INFO,
    userInfo
  }
};

//Thunk Creators
export function fetchUserInfo(userId){
  return function thunk(dispatch){
    // const meetupIdArray=[]
	return axios.get(`/api/user/${userId}`)
	.then(res => {
		return res.data
	})
	.then(result => {
		const action = getUserInfo(result)
		dispatch(action)
	})
  }
}
		

//UserInfo Reducer
const UserInfoReducer = function(state = {}, action) {
  switch (action.type) {
    case GET_USER_INFO : return action.userInfo
    default:
      return state;
  }
};

export default UserInfoReducer;

