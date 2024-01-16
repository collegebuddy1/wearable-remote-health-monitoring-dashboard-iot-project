import { API, graphqlOperation } from 'aws-amplify';
import {onCreateAlert} from "../graphql/subscriptions";
import {listAlerts} from "../graphql/queries";
import {deleteAlert, updateDevice} from "../graphql/mutations";
import {enqueueAppNotification} from "./notificationActions";

// ====================================---ALERT SUBSCRIPTION---==========================================
// Subscribe to alerts, sets realtime connection status flag
export const subscribeAlerts = () => {
    return (dispatch) => {
        dispatch({type: "ALERT_SUBSCRIPTION_INITIATED"});
        try {
            API.graphql(graphqlOperation(onCreateAlert)).subscribe({
                next: alert => {
                    console.log("new alert: ", alert.value.data.onCreateAlert);
                    dispatch(newAlertReceived(alert.value.data.onCreateAlert));
                },
                error: err => {
                    console.log("Alert subscription error: ", err);
                    dispatch(subscribeAlertsFailure(err));
                }
            })
        } catch (err) {
            dispatch(subscribeAlertsFailure(err));
            console.log("Alert error: ", err);
        }

    }
}

// Error/Connection closed, unset realtime connection status flag
export const subscribeAlertsFailure = (err) => {
    return (dispatch) => {
        dispatch({type: "ALERT_SUBSCRIPTION_CLOSED", payload: err});
        // send out app notification to refresh app
        enqueueAppNotification({type: "error",
            message: "Real Time connection error. Please check your internet connection and refresh the page."});
    }
}

// add new alerts to local state
export const newAlertReceived = (payload) => {
    return {
        type: "NEW_ALERT_RECEIVED",
        payload: payload
    }
}

// ====================================---FETCH ALERTS---==========================================

// Fetch alerts from DynamoDB, set loading flag
export const fetchAlerts = () => {
    return (dispatch) => {
        dispatch({ type: "FETCH_ALERTS_REQUEST" });
        API.graphql(graphqlOperation(listAlerts)).then((response) => {
            const alerts = response.data.listAlerts.items;
            dispatch(fetchAlertsSuccess(alerts));
        }).catch((err) => {
            console.log("Error fetching alerts: ", err);
            dispatch(fetchAlertsFailure(err));
        })
    }
}

// NOT YET IMPLEMENTED: respond to failure condition
export const fetchAlertsFailure = (error) => {
    return {
        type: "FETCH_ALERTS_FAILURE",
        payload: error
    }
}

// Success condition, update local state with fetched alerts data
export const fetchAlertsSuccess = (payload) => {
    return {
        type: "FETCH_ALERTS_SUCCESS",
        payload: payload
    }
}


// ====================================---DELETE ALERT---==========================================

// Delete alerts from DynamoDB, and locally
export const deleteAlertRequest = (payload) => {
    return (dispatch) => {
        dispatch({ type: "DELETE_ALERT_REQUEST", payload: payload });
        API.graphql(graphqlOperation(deleteAlert, {input: {id: payload.alertID}})).then((response) => {
        }).catch((err) => {
            console.log("Error deleting alert: ", err);
            dispatch(deleteAlertFailure(err));
        })
    }
}

// NOT YET IMPLEMENTED: respond to failure condition
export const deleteAlertFailure = (error) => {
    return {
        type: "DELETE_ALERT_FAILURE",
        payload: error
    }
}
// ====================================---CLEAR DEVICE STATUS---==========================================

// clear device status so that so that new alerts can be generated
export const clearDeviceStatus = (payload) => {
    return (dispatch) => {
        dispatch({type: "CLEAR_DEVICE_STATUS", payload: payload});
        API.graphql(graphqlOperation(updateDevice, {input: {id: payload.deviceID, deviceStatus: "Normal"}})).then((response) => {
            dispatch(deleteAlertSuccess());
        }).catch((err) => {
            console.log("Error deleting alert: ", err);
            dispatch(deleteAlertFailure(err));
        })
    }
}

// Respond to success condition
export const deleteAlertSuccess = () => {
    return (dispatch) => {
        dispatch({type: "DELETE_ALERT_SUCCESS" });
        enqueueAppNotification({type: "info", message: "Alert resolved successfully."})
    }
}
