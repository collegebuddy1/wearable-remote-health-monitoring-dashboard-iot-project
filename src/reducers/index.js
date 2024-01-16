import { combineReducers } from "redux";
import alertReducer from "./alertReducer";
import userReducer from "./userReducer";
import deviceReducer from "./deviceReducer";
import appStatusReducer from "./appStatusReducer";
import locationReducer from "./locationReducer";
import notificationReducer from "./notificationReducer";

export default combineReducers({
    alerts: alertReducer,
    users: userReducer,
    devices: deviceReducer,
    applicationStatus: appStatusReducer,
    locations: locationReducer,
    notifications: notificationReducer,
});