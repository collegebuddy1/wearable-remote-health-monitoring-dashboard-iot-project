

// Remove alert notification from the state
export const removeAlertNotification = (payload) => {
    return {
        type: "REMOVE_ALERT_NOTIFICATION",
        payload: payload
    }
}

// Remove app notification from the state
export const removeAppNotification = (payload) => {
    return {
        type: "REMOVE_APP_NOTIFICATION",
        payload: payload
    }
}


// Add app notification to the state
export const enqueueAppNotification = (payload) => {
    return {
        type: "ENQUEUE_APP_NOTIFICATION",
        payload: payload
    }
}
