import { combineReducers } from "redux";
import user from "./user";
import map from "./map";
import userMeetup from "./user-meetup";
import place from "./place";
import userDashboard from "./user-dashboard";
import confirmation from "./confirmation";

// Simple reducer for display on main
const DISPLAY_MAIN = "DISPLAY_MAIN"; //  To render the main component

export function displayMain(flag) {
    return {
        type: DISPLAY_MAIN,
        flag // flag is a boolean
    };
}

const display = (state = false, action) => {
    switch (action.type) {
        case DISPLAY_MAIN:
            return action.flag;
        default:
            return state;
    }
};

export default combineReducers({
    user,
    display,
    map,
    userMeetup,
    place,
    userDashboard,
    confirmation
});

export * from "./user";
export * from "./user-meetup";
export * from "./place";
export * from "./user-dashboard";