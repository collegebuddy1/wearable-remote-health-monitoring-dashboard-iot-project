const AWS = require('aws-sdk');
const dispatchAlert = require("../Actions/dispatchAlert.js");
const updateDevice = require("../Actions/updateDevice.js");

/** TODO: To be Implemented.
 *
 * A naive heart rate anomaly detection method is provided here.
 * Processes Heart Rate Data generated over the last 5 minutes. */
const processHeartRate = async (data) => {

    // fetch data from user's device
    let deviceInfo = await fetchDeviceInfoHelper(data[0].deviceID);

    // check if the device status is already set to "HeartRate_Anomaly", if so we don't need
    // to generate another alert
    if (deviceInfo.deviceStatus === "HeartRate_Anomaly") {
        return;
    }
    let location = deviceInfo.lastLocation;

    // Define our upper and lower thresholds
    let upperThreshold = 130;
    let lowerThreshold = 30;

    let average;

    let dataCount = data.length;
    let sum = 0;
    // iterate through and add our data values
    for (let entry of data) {
        sum += entry.observationValue;
    }
    // calculate the average
    average = sum / dataCount;


    // Generate a heart rate alert and update device status if an anomaly is detected
    if (average >= upperThreshold) {
        await dispatchAlert({userID: data[0].userID, type: "heart_rate",
            description: "Heart rate high", location: location, createdAt: data[0].createdAt});
        await updateDevice({deviceID: data[0].deviceID, deviceStatus: "HeartRate_Anomaly"});
    } else if (average <= lowerThreshold) {
        await dispatchAlert({userID: data[0].userID, type: "heart_rate",
            description: "Heart rate low", location: location, createdAt: data[0].createdAt});
        await updateDevice({deviceID: data[0].deviceID, deviceStatus: "HeartRate_Anomaly"});
    }

}

//================================================---Helper Functions---==========================================

// fetch user's latest location if it exists
const fetchDeviceInfoHelper = async (deviceID) => {
    return new Promise(function(resolve, reject) {

        // initialize AWS DynamoDB Document Client instance
        const documentClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

        // search parameters
        let params = {
            TableName: process.env.DEVICE_TABLE,
            Key: {
                'id': deviceID
            },
            ProjectionExpression: "lastLocation, deviceStatus",
        };

        documentClient.get(params, function(err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                reject(err);
            } else {
                // successful response
                resolve(data.Item);
            }
        });
    });
}


module.exports = processHeartRate;