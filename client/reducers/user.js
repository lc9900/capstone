// User reducer
import axios from 'axios';

// ACTION TYPES
const SET_CURRENT_USER = 'SET_CURRENT_USER';
const REMOVE_CURRENT_USER = 'REMOVE_CURRENT_USER';

// ACTION CREATORS
export function setCurrentUser(user) {
    return {
    type: SET_CURRENT_USER,
    user
    };
}

export function removeCurrentUser() {
    return {
        type: REMOVE_CURRENT_USER,
        user: {}
    };
}

// THUNK
export function verifyUser(credential){
    return function thunk (dispatch) {
        return axios.post('/api/auth', credential)
          .then(res => res.data)
            .then(user => {
                if (user) {
                    dispatch(setCurrentUser(user));
                }
            })
            .catch(err => { throw err; });
    };
}

export function addUser(userInfo){
    return function thunk(dispatch) {
        return axios.post('/api/auth/signup', userInfo)
            .then(res => res.data)
            .then((user) => {
                dispatch(setCurrentUser(user));
            })
            .catch(err => { throw err; });
    };
}

export function logout(){
    return function thunk(dispatch){
        return axios.post('/api/auth/logout')
                    .then(() => {
                        dispatch(removeCurrentUser());
                    })
                    .catch( err => { throw err; });
    }
}

export function loadUser(){
    return function thunk(dispatch){
        return axios.get('/api/auth/me')
                .then(res => res.data)
                .then(user => {
                    if (user) dispatch(setCurrentUser(user));
                });
    }
}

// REDUCER
export default function reducer (state = {}, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return action.user;
        case REMOVE_CURRENT_USER:
            return action.user;
        default:
            return state;
    }
}
