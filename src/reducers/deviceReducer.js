
const initialDevices = [];


const pairDeviceHelper = (devices, payload) => {
    devices.forEach(device => {
        if (device.id === payload.device.id) {
            device.userID = payload.user.id;
        }
    })

    return devices;
}

const unpairDeviceHelper = (devices, payload) => {
    devices.forEach(device => {
        if (device.id === payload.deviceID) {
            device.userID = null;
        }
    })

    return devices;
}


const deleteDeviceHelper = (devices, target) => {
    const index = devices.findIndex(device =>
        device.id === target.deviceID
    );

    if (index !== -1) {
        devices.splice(index, 1);
    }

    return devices;
}

// add geofence to device
const assignGeofenceHelper = (devices, payload) => {
    devices.forEach(device => {
        if (device.id === payload.id) {
            device.geofence = payload.geofence;
        }
    })
    return devices;
}

// remove geofence from device
const removeGeofenceHelper = (devices, payload) => {
    devices.forEach(device => {
        if (device.id === payload.id) {
            device.geofence = null;
        }
    })
    return devices;
}

// clear device status
const clearDeviceStatusHelper = (devices, payload) => {
    devices.forEach(device => {
        if (device.id === payload.deviceID) {
            device.deviceStatus = "Normal";
        }
    })

    return devices;
}

// handle device updates
const updatedDeviceHelper = (devices, payload) => {
    let newDevices = [];
    devices.forEach(device => {
        if (device.id === payload.id) {
            device = {...payload};
        }
        newDevices.push(device);
    })
    return newDevices;
}

const deviceReducer = (devices = initialDevices, action) => {
    let newDeviceList = [...devices];
    switch (action.type) {
        case "FETCH_DEVICES_SUCCESS": {
            return action.payload;
        }
        case "REGISTER_NEW_DEVICE": {
            return [...newDeviceList, {id: action.payload.id, userID: null,
                deviceStatus: action.payload.deviceStatus, deviceOS: action.payload.deviceOS,
                osVersion: action.payload.osVersion, geofence: null, data: null}];
        }
        case "NEW_DEVICE_FOUND": {
            return [...newDeviceList, action.payload];
        }
        case "ASSOCIATE_NEW_DEVICE": {
            return pairDeviceHelper(newDeviceList, action.payload);
        }
        case "DISASSOCIATE_DEVICE": {
            return unpairDeviceHelper(newDeviceList, action.payload);
        }
        case "DELETE_DEVICE": {
            return deleteDeviceHelper(newDeviceList, action.payload);
        }
        case "ASSIGN_LOCATION": {
            return assignGeofenceHelper(newDeviceList, action.payload);
        }
        case "REMOVE_LOCATION": {
            return removeGeofenceHelper(newDeviceList, action.payload);
        }
        case "CLEAR_DEVICE_STATUS": {
            return clearDeviceStatusHelper(newDeviceList, action.payload);
        }
        case "DEVICE_UPDATED": {
            return updatedDeviceHelper(newDeviceList, action.payload);
        }
        default:
            return newDeviceList;
    }

};

export default deviceReducer;