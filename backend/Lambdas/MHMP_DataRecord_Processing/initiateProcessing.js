const AWS = require('aws-sdk');
const processGeofence = require("./Processing/processGeofence.js");
const updateDevice = require("./Actions/updateDevice.js");
const dumpData = require("./Actions/dumpData.js");
const registerDevice = require("./Actions/registerDevice.js");

/*
*   Description: Validates device then delegates downstream data processing and temporary data storage.
*   Required Inputs: Raw data payload from the device containing the following: heart_rate, deviceID, latitude,
*                    longitude, time.
*   Expected Output: No return value.
 */
const initiateProcessing = async (payload) => {

    //=========================---Parse and Extract Data from Payload---=========================
    // parse payload
    const obj = JSON.parse(payload);
    // extract relevant data
    let heartRate = obj.heart_rate;
    let deviceID = obj.deviceID;
    let deviceOS = obj.deviceOS;
    let latitude = obj.latitude;
    let longitude = obj.longitude;
    let time = obj.time;

    //============================---Device Data Retrieval and Validation---======================

    let deviceData;

    try {

        // Obtain required Device Data { deviceGeofenceId, deviceStatus, userID } associated with the given deviceID
        deviceData = await readDeviceHelper(deviceID);

        // Null/undefined data check (means that the device does not exist in the database)
        if (!deviceData) {
            console.log('Error: Data processing aborted. The device with id: "' +  deviceID +
                '" was not found in the database. Device is now being registered...');
            // register device in DynamoDB
            await registerDevice({deviceID: deviceID, deviceOS: deviceOS});
            // abort function
            return;
        }

        // Check that the device has an associated user
        if (!deviceData.userID) {
            console.log('Error: Data processing aborted. There is no user associated with device id "' +  deviceID +
                '".');
            // abort data processing as there is no user associated with this device
            return;
        }

    } catch (err) {
        console.log("Error: Data processing aborted. A problem occurred during device data retrieval: ", err);
        return;
    }

    //========================---Handle Downstream Data Processing:---===========================

    // Update device's lastHeartRate [no deviceStatus or lastLocation update]
    if ((deviceData.deviceStatus === "HeartRate_Anomaly") || (deviceData.deviceStatus === "Location_Anomaly")) {
        // update device without changing current device Status
        await updateDevice({id: deviceID, deviceStatus: deviceData.deviceStatus, lastLocation: null, lastHeartRate: heartRate});
    } else {
        await updateDevice({id: deviceID, deviceStatus: "Normal", lastLocation: null, lastHeartRate: heartRate});
    }
    // geofence anomaly detection and alert generation
    await processGeofence({deviceID: deviceID, userID: deviceData.userID, time: time, latitude: latitude, longitude: longitude,
        deviceStatus: deviceData.deviceStatus, deviceGeofenceId: deviceData.deviceGeofenceId});

    //==============================---Handle Data Dump---=======================================


    // Create Data record for heart rate data in DynamoDB
    await dumpData({deviceID: deviceID, userID: deviceData.userID, observationType: "heart_rate",
        observationUnit: "BPM", observationValue: heartRate, createdAt: time});

}

//==================================---Helper Functions---=============================================

// Retrieves geofenceID, deviceStatus, and userID from given device in DynamoDB
const readDeviceHelper = (deviceID) => {
    return new Promise(function(resolve, reject) {
        // Set the AWS region
        AWS.config.update({region: process.env.AWS_REGION});
        // initialize AWS DynamoDB Document Client instance
        const documentClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
        // search parameters
        let paramsDevice = {
            TableName: process.env.DEVICE_TABLE,
            Key: {
                'id': deviceID
            },
            ProjectionExpression: "deviceGeofenceId, deviceStatus, userID",
        };
        // call Document Client
        documentClient.get(paramsDevice, function(err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                reject(err);
            } else {
                // successful response
                resolve(data.Item);
            }
        });

    });
};



//=====================================================================================================

module.exports = initiateProcessing;