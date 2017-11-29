// User reducer
import axios from "axios";

// ACTION TYPES
const GET_MEETUP = "GET_MEETUP";

// ACTION CREATORS
export function getMeetup(meetup) {
    return {
        type: GET_MEETUP,
        meetup
    };
}

// THUNK

export function fetchMeetup(id) {
    return function thunk(dispatch) {
        return axios
            .get(`/api/meetup/${id}`)
            .then(res => dispatch(getMeetup(res.data)))
            .catch(err => {
                throw err;
            });
    };
}

// REDUCER
export default function Meetup(meetup = {}, action) {
    switch (action.type) {
        case GET_MEETUP:
            return action.meetup;
        default:
            return meetup;
    }
}
