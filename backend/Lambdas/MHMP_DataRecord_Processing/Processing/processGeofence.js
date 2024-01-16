const AWS = require('aws-sdk');
const dispatchAlert  = require("../Actions/dispatchAlert.js");
const updateDevice = require("../Actions/updateDevice.js");

/*
*   Description: Processes Data for Location Anomaly/Breach Detection
*   Required Inputs: deviceID, time, latitude, longitude
*   Expected Output: No return value. Updates deviceStatus and lastLocation and dispatches an Alert if anomaly detected.
 */
const processGeofence = async (data) => {

    // Extract fields from input data
    const {deviceID, userID, time, latitude, longitude, deviceStatus, deviceGeofenceId} = data;

    //================================---Input Data Validation---==================================

    // Null/undefined data check
    if (!latitude || !longitude) {
        // abort function, we don't have the required data for geofence processing
        console.log("Error: Geofence processing failed. Location data is invalid or missing.")
        return;
    }

    // Check that deviceGeofenceId exists
    if (!deviceGeofenceId) {
        console.log("Error: Geofence processing failed. No geofence found for selected device.");
        // abort function, no geofence data found
        return;
    }

    //=================================================================================================


    // Set the AWS region
    AWS.config.update({region: process.env.AWS_REGION});
    // initialize AWS DynamoDB Document Client instance
    const documentClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});


    try {
        //=================================---Device Status Check---==============================


        // check the device status, if it is already set to "Location_Anomaly" or "HeartRate_Anomaly" (higher priority)
        // we can update the device's current location and return without generating another alert
        if ((deviceStatus === "Location_Anomaly") || (deviceStatus === "HeartRate_Anomaly")) {
            let location = { lat: latitude, lng: longitude };
            await updateDevice({id: deviceID, deviceStatus: deviceStatus, lastLocation: location, lastHeartRate: null});
            return;
        }


        //=================================---Geofence/Location Data Retrieval and Validation---===============================

        // now attempt retrieval of the geofence (assigned location) boundary points
        let geofenceData = await fetchGeofenceHelper(documentClient, deviceGeofenceId);
        // validate that we have a boundary
        if (!geofenceData.boundary) {
            console.log("Error: No geofence boundary found for selected geofence ID.");
            // abort function, no geofence boundary found
            return;
        }
        let boundary = geofenceData.boundary;
        // validate that the geofence boundary array contains at least 3 coordinates to be valid
        if (boundary.length <= 2) {
            console.log("Error: Invalid geofence boundary.");
            // abort function, invalid geofence boundary
            return;
        }

        // ==================================---Bounds Checking and Alert Generation---==================================

        // now check if current location is within geofence bounds. If it returns false, dispatch geofence alert
        let currentLocation = {lat: latitude, lng: longitude};
        if (!boundsCheck(boundary, currentLocation)) {
            await dispatchAlert({deviceID: deviceID, userID: userID, type: "location", description: "Location breached",
               location: currentLocation, createdAt: time});
            // update device status and location
            await updateDevice({id: deviceID, deviceStatus: "Location_Anomaly", lastLocation: currentLocation, lastHeartRate: null});
        }
        // ================================================================================================================
    } catch (err) {
        console.log("Error: A problem occurred during geofence processing: ", err);
    }

};

// ===========================================---Helper Functions---========================================

// Retrieves location/geofence boundary points from DynamoDB
const fetchGeofenceHelper = (documentClient, geofenceID) => {
    return new Promise(function(resolve, reject) {
        // search parameters
        let paramsLocation = {
            TableName: process.env.LOCATION_TABLE,
            Key: {
                'id': geofenceID
            },
            ProjectionExpression: "boundary",
        };

        // Call DynamoDB to fetch the item from the table
        documentClient.get(paramsLocation, function(err, data) {
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

// Checks that the device's location is with the assigned bounds
const boundsCheck = (boundary, currentLocation) => {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

    const {lat, lng} = currentLocation;
    let x = lat, y = lng;

    let inside = false;
    for (let i = 0, j = boundary.length - 1; i < boundary.length; j = i++) {
        let xi = boundary[i]['lat'], yi = boundary[i]['lng'];
        let xj = boundary[j]['lat'], yj = boundary[j]['lng'];

        let intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

//=====================================================================================================

module.exports = processGeofence;