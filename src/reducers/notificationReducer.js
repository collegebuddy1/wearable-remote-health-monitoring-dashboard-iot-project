import { v4 as uuidv4 } from "uuid";

const initialNotifications = {
    alertNotifications: [],
    appNotifications: [],
};

// remove/dismiss alert notification
const removeAlert = (alerts, target) => {

    const index = alerts.findIndex(alert =>
        alert.id === target.id
    );

    if (index !== -1) {
        alerts.splice(index, 1);
    }

    return [...alerts];
}

// remove/dismiss app notification
const removeAppNotification = (notifications, target) => {
    const index = notifications.findIndex(notification =>
        notification.id === target.id
    );

    if (index !== -1) {
        notifications.splice(index, 1);
    }

    return [...notifications];
}

const notificationReducer = (notifications = initialNotifications, action) => {
    switch (action.type) {
        case "NEW_ALERT_RECEIVED": {
            return {
                ...notifications,
                alertNotifications: [action.payload, ...notifications.alertNotifications],
            };
        }
        case "REMOVE_ALERT_NOTIFICATION": {
            return {
                ...notifications,
                alertNotifications: removeAlert(notifications.alertNotifications, action.payload)
            };
        }
        case "ENQUEUE_APP_NOTIFICATION": {
            return {
                ...notifications,
                appNotifications: [...notifications.appNotifications,
                    {id: uuidv4(), type: action.payload.type, message: action.payload.message }]
            }
        }
        case "REMOVE_APP_NOTIFICATION": {
            return {
                ...notifications,
                appNotifications: removeAppNotification(notifications.appNotifications, action.payload)
            }
        }
        default:
            return notifications;
    }
}



export default notificationReducer;