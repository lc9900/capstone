// User reducer
import axios from "axios";

// ACTION TYPES
const SET_VENUE = "SET_VENUE";


// ACTION CREATORS
export function setVenue(venue) {
    return {
        type: SET_VENUE,
        venue
    };
}

//Thunk Creators
export function fetchVenue(location) {
    return function thunk(dispatch) {
        const { lat, lng } = location;
        return axios
            .get(`/api/venue/search?location=${lat},${lng}`)
            .then(res => res.data)
            .then(({name, vicinity, place_id, geometry}) =>
                dispatch(setVenue({
                    googleId: place_id,
                    name,
                    address: vicinity,
                    lat: geometry.location.lat,
                    lng: geometry.location.lng
                }))
            )
            .catch(err => {
                throw err;
            });
    };
}

// REDUCER
export default function Venue(
    venue = {
        googleId: '',
        name: '',
        address: '',
        lat: 0,
        lng: 0
    },
    action
) {
    switch (action.type) {
        case SET_VENUE:
            return action.venue;
        default:
            return venue;
    }
}
