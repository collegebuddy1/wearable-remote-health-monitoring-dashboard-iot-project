const initialState = {
    startupLoading: true,
    usersFetched: false,
    devicesFetched: false,
    locationsFetched: false,
    alertsFetched: false,
    errorState: false,
    alertsConnected: false,
    errorMessage: "",
}

// Returns true if all other data has been successfully fetched. Prevents a race condition.
const isLastToLoad = (appStatus) => {
    let falseCount = 0;
    if (appStatus.usersFetched === false) {
        falseCount += 1;
    }
    if (appStatus.devicesFetched === false) {
        falseCount += 1;
    }
    if (appStatus.locationsFetched === false) {
        falseCount += 1;
    }
    if (appStatus.alertsFetched === false) {
        falseCount += 1;
    }

    return ((falseCount === 1) || (falseCount === 0));
}


const appStatusReducer = (appStatus = initialState, action) => {
    let newAppStatus = appStatus;
    // checks if all other data has been retrieved. Required to prevent a race condition.
    let lastToLoad = isLastToLoad(appStatus);


    switch(action.type) {
        case "FETCH_USERS_REQUEST": {
            return {
                ...newAppStatus,
                startupLoading: true,
            }
        }
        case "FETCH_USERS_SUCCESS": {
            return {
                ...newAppStatus,
                startupLoading: !(lastToLoad),
                usersFetched: true,
            }
        }
        case "FETCH_USERS_FAILURE": {
            return {
                ...newAppStatus,
                startupLoading: false,
                errorState: true,
                errorMessage: action.payload,
            }
        }
        case "FETCH_DEVICES_REQUEST": {
            return {
                ...newAppStatus,
                startupLoading: true,
            }
        }
        case "FETCH_DEVICES_SUCCESS": {
            return {
                ...newAppStatus,
                startupLoading: !(lastToLoad),
                devicesFetched: true,
            }
        }
        case "FETCH_DEVICES_FAILURE": {
            return {
                ...newAppStatus,
                startupLoading: false,
                errorState: true,
                errorMessage: action.payload,
            }
        }
        case "FETCH_LOCATIONS_REQUEST": {
            return {
                ...newAppStatus,
                startupLoading: true,
            }
        }
        case "FETCH_LOCATIONS_SUCCESS": {
            return {
                ...newAppStatus,
                startupLoading: !(lastToLoad),
                locationsFetched: true,
            }
        }
        case "FETCH_LOCATIONS_FAILURE": {
            return {
                ...newAppStatus,
                startupLoading: false,
                errorState: true,
                errorMessage: action.payload,
            }
        }case "FETCH_ALERTS_REQUEST": {
            return {
                ...newAppStatus,
                startupLoading: true,
            }
        }
        case "FETCH_ALERTS_SUCCESS": {
            return {
                ...newAppStatus,
                startupLoading: !(lastToLoad),
                alertsFetched: true,
            }
        }
        case "FETCH_ALERTS_FAILURE": {
            return {
                ...newAppStatus,
                startupLoading: false,
                errorState: true,
                errorMessage: action.payload,
            }
        }
        case "ALERT_SUBSCRIPTION_INITIATED": {
            return {
                ...newAppStatus,
                alertsConnected: true,
            }
        }
        case "ALERT_SUBSCRIPTION_CLOSED": {
            return {
                ...newAppStatus,
                alertsConnected: false,
            }
        }
        default:
            return newAppStatus;
    }

}

export default appStatusReducer;