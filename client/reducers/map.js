// User reducer
import axios from "axios";

// ACTION TYPES
const SET_USER_START = "SET_USER_START";
const SET_FRIEND_START = "SET_FRIEND_START";
const SET_MEETING_DESTINATION = "SET_MEETING_DESTINATION";

// ACTION CREATORS
export function setUserStart(location) {
    return {
        type: SET_USER_START,
        location
    };
}

export function setFriendStart(location) {
    return {
        type: SET_FRIEND_START,
        location
    };
}

export function setMeetingDestination(location) {
    return {
        type: SET_MEETING_DESTINATION,
        location
    };
}

//Thunk Creators
export function fetchMeetingDestination(location) {
    return function thunk(dispatch) {
        const { lat, lng } = location;
        return axios
            .get(`/api/venue/search?location=${lat},${lng}`)
            .then(res =>
                dispatch(setMeetingDestination(res.data.geometry.location))
            )
            .catch(err => {
                throw err;
            });
    };
}

// REDUCER
export default function Map(
    locations = {
        userStart: {},
        friendStart: {},
        meetingDestination: {}
    },
    action
) {
    switch (action.type) {
        case SET_USER_START:
            return { ...locations, userStart: action.location };
        case SET_FRIEND_START:
            return { ...locations, friendStart: action.location };
        case SET_MEETING_DESTINATION:
            return { ...locations, meetingDestination: action.location };
        default:
            return locations;
    }
}
