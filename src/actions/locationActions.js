import { API, graphqlOperation } from 'aws-amplify';
import { createLocation, deleteLocation } from '../graphql/mutations';
import {listLocations} from "../graphql/queries";
import {enqueueAppNotification} from "./notificationActions";


// ===================================---FETCH LOCATIONS---=============================================
// Fetch locations from AWS, set loading flag
export const fetchLocations = () => {
    return (dispatch) => {
        dispatch({ type: "FETCH_LOCATIONS_REQUEST" });
        API.graphql(graphqlOperation(listLocations)).then((response) => {
            const locations = response.data.listLocations.items;
            dispatch(fetchLocationsSuccess(locations));
        }).catch((err) => {
            console.log("Error fetching locations: ", err);
            dispatch(fetchLocationsFailure(err));
        })
    }
}

// Respond to failure condition
export const fetchLocationsFailure = (error) => {
    return (dispatch) => {
        dispatch({type: "FETCH_LOCATIONS_FAILURE", payload: error});
        dispatch(enqueueAppNotification({type: "error", message: "Error fetching locations, please refresh the page: " + error}));
    }
}

// Success condition, update local state with fetched location data, remove loading flag
export const fetchLocationsSuccess = (payload) => {
    return {
        type: "FETCH_LOCATIONS_SUCCESS",
        payload: payload
    }
}

// =====================================---ADDING NEW LOCATION---=======================================

// Add new location locally and to DynamoDB
export const addNewLocation = (payload) => {
    return (dispatch) => {
        dispatch({type: "ADD_NEW_LOCATION_REQUEST", payload: payload});
        API.graphql(graphqlOperation(createLocation, {input: payload})).then((response) => {
            dispatch(addNewLocationSuccess());
        }).catch((err) => {
            console.log("Error adding new location: ", err);
            dispatch(addNewLocationFailure(err));
        })
    }
}

// Respond to failure condition
export const addNewLocationFailure = (error) => {
    return (dispatch) => {
        dispatch({type: "ADD_NEW_LOCATION_FAILURE", payload: error});
        dispatch(enqueueAppNotification({type: "error", message: "Error adding location: " + error.errors[0].message}));
    }
}

// Respond to success condition
export const addNewLocationSuccess = () => {
    return (dispatch) => {
        dispatch({ type: "ADD_NEW_LOCATION_SUCCESS"});
        dispatch(enqueueAppNotification({type: "success", message: "New location added successfully!"}));
    }
}

// =====================================---DELETING LOCATION---=======================================

// Delete location locally and in DynamoDB
export const deleteLocationRequest = (payload) => {
    return (dispatch) => {
        dispatch({type: "DELETE_LOCATION_REQUEST", payload: payload});
        API.graphql(graphqlOperation(deleteLocation, {input: payload})).then((response) => {
            dispatch(deleteLocationSuccess());
        }).catch((err) => {
            console.log("Error deleting location: ", err);
            dispatch(deleteLocationFailure(err));
        })
    }
}

// Respond to failure condition
export const deleteLocationFailure = (error) => {
    return (dispatch) => {
        dispatch({type: "DELETE_LOCATION_FAILURE", payload: error});
        dispatch(enqueueAppNotification({type: "error", message: "Error deleting location: " + error.errors[0].message}));
    }
}

// Respond to success condition
export const deleteLocationSuccess = () => {
    return (dispatch) => {
        dispatch({ type: "DELETE_LOCATION_SUCCESS"});
        dispatch(enqueueAppNotification({type: "info", message: "Location deleted successfully!"}));
    }
}

