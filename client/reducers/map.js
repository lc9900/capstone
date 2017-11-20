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

// THUNK
export function verifyUser(credential) {
    return function thunk(dispatch) {
        return axios
            .post("/api/auth", credential)
            .then(res => res.data)
            .then(user => {
                if (user) {
                    dispatch(setCurrentUser(user));
                }
            })
            .catch(err => {
                throw err;
            });
    };
}

// REDUCER
export default function Map(
    locations = {
        userStart: { lat: 40.705312, lng: -74.009197 },
        friendStart: { lat: 40.802051, lng: -73.957088 },
        meetingDestination: { lat: 40.762935, lng: -73.984957 }
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
