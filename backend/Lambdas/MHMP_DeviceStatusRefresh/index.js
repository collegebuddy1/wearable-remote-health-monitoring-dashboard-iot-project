'use strict';
const AWS = require('aws-sdk');
const updateDevice = require("./Actions/updateDevice.js");

/*
*   Description: Checks if devices have been generating data output over the last 5 minutes.
*                Flags inactive devices. Runs every hour.
*   Expected Output: No return value. Updates device status if no data found.
 */
exports.handler = async (event) => {


    // Set the AWS region
    AWS.config.update({region: process.env.AWS_REGION});
    // initialize AWS DynamoDB Document Client instance
    const documentClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});


    try{
        //==================================---Fetch List Of Devices---======================================

        // fetches list of device IDs and associated users IDs
        let devices = await fetchDevices(documentClient);

        //=============================---Check If Device Data Output Exists For Each Device---=========================

        // fetch device data output for each user
        for (let device of devices) {
            let data = await fetchData(documentClient, device.id);
            // guard against null/undefined return value
            if (data) {
               if (data.length === 0) {
                   // update device status to "Inactive"
                    await updateDevice({deviceID: device.id, deviceStatus: "Inactive"});
               }
            }
        }

    } catch (err) {
        console.log("Error: Anomaly detection failed with error: ", err);
    }
    

};


//=========================================---Helper Functions---=========================================

// fetches devices that have an associated user
const fetchDevices = async (documentClient) => {
    return new Promise(function(resolve, reject) {
        // search parameters
        let params = {
            TableName: process.env.DEVICE_TABLE,
            ProjectionExpression: "id, userID, deviceStatus",
            FilterExpression: "attribute_exists(#userID)",
            ExpressionAttributeNames: {
                "#userID": "userID"
            }
        };

        let scannedDevices = [];
        documentClient.scan(params, onScan);

        function onScan(err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                reject(err);
            } else {
                // successful response
                // add each returned item to our array
                data.Items.forEach((item) =>  scannedDevices.push(item));
                // check if any more items exists
                if (typeof data.LastEvaluatedKey != "undefined") {
                    params.ExclusiveStartKey = data.LastEvaluatedKey;
                    // run the scan again from the lastEvaluatedKey
                    documentClient.scan(params, onScan);
                } else {
                    // No more devices to be fetched, we can resolve with our results
                    resolve( scannedDevices);
                }
            }
        }
    });
}


// fetches data for a given user and deviceID
const fetchData = async (documentClient, deviceID) => {
    return new Promise(function(resolve, reject) {

        // set search time interval (in minutes).
        // We are restricting our search to a 5 minute interval to reduce costs from unnecessary data retrieval.
        let timeInterval  = 5;

        // get the time that is X minutes before the current time
        let dateTimeStart = new Date(new Date().getTime() - timeInterval*60000).toISOString();


        let params = {
            TableName: process.env.DATA_TABLE,
            IndexName: "byDeviceID",
            KeyConditionExpression: "#deviceID = :deviceID AND #createdAt >= :rangeStart",
            ProjectionExpression: "id, createdAt",
            ExpressionAttributeNames: {
                "#deviceID": "deviceID",
                "#createdAt": "createdAt"
            },
            ExpressionAttributeValues: {
                ":deviceID": deviceID,
                ":rangeStart": dateTimeStart
            }
        };


        documentClient.query(params, function(err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                reject(err);
            } else {
                // successful response
                resolve(data.Items);
            }
        });

    });
}

//============================================================================================================
