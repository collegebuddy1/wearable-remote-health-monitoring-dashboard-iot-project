'use strict';
const AWS = require('aws-sdk');
const processHeartRate = require("./Processing/processHeartRate.js");

/*
*   Description: Processes recent historical data for heart rate anomalies. Runs every 5 minutes.
*   Expected Output: No return value. Generates an Alert for heart rate anomalies, and updates device status.
 */
exports.handler = async (event) => {


    // Set the AWS region
    AWS.config.update({region: process.env.AWS_REGION});
    // initialize AWS DynamoDB Document Client instance
    const documentClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});


    try{
        //==================================---Fetch List Of Users---======================================

        // fetches list of user IDs and associated device IDs (if any)
        let users = await fetchUsersHelper(documentClient);


        //=============================---Fetch Device Data Output For each User---=========================

        // fetch heart rate data for each user
        for (let user of users) {
            let heartRateData = await fetchData(documentClient, user.id, "heart_rate");
            // guard against null/undefined return value
            if (heartRateData) {
               if (heartRateData.length !== 0) {
                   // process data
                   await processHeartRate(heartRateData);
               }
            }
        }

    } catch (err) {
        console.log("Error: Anomaly detection failed with error: ", err);
    }
    

};


//=========================================---Helper Functions---=========================================

// fetches users that have an associated device
const fetchUsersHelper = async (documentClient) => {
    return new Promise(async function(resolve, reject) {
        // search parameters
        let params = {
            TableName: process.env.USER_TABLE,
            ProjectionExpression: "id, userDeviceId",
            FilterExpression: "attribute_exists(#deviceID)",
            ExpressionAttributeNames: {
                "#deviceID": "userDeviceId"
            }
        };

        let scannedUsers = [];

        documentClient.scan(params, onScan);

        function onScan(err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                reject(err);
            } else {
                // successful response
                // add each returned item to our array
                data.Items.forEach((item) => scannedUsers.push(item));
                // check if any more items exists
                if (typeof data.LastEvaluatedKey != "undefined") {
                    params.ExclusiveStartKey = data.LastEvaluatedKey;
                    // run the scan again from the lastEvaluatedKey
                    documentClient.scan(params, onScan);
                } else {
                    // No more users to be fetched, we can resolve with our results
                    resolve(scannedUsers);
                }
            }
        }
    });
}


// fetches data for a given user and a given data type
const fetchData = async (documentClient, userID, observationType) => {
    return new Promise(function(resolve, reject) {

        // set search time interval (in minutes)
        let timeInterval  = 5;

        // get the current time
        let dateTimeEnd = new Date().toISOString();
        // define the end of our search range
        let rangeEnd = observationType.concat("#" + dateTimeEnd);

        // get the time that is X minutes before the current time
        let dateTimeStart = new Date(new Date().getTime() - timeInterval*60000).toISOString();
        // define the start of our search range
        let rangeStart = observationType.concat("#" + dateTimeStart);


        let params = {
            TableName: process.env.DATA_TABLE,
            IndexName: "byUserIDAndObservationType",
            KeyConditionExpression: "#userID = :userID AND #Range BETWEEN :rangeStart AND :rangeEnd",
            ProjectionExpression: "userID, deviceID, observationValue, observationUnit, createdAt",
            ExpressionAttributeNames: {
                "#userID" : "userID",
                "#Range": "observationType#createdAt"
            },
            ExpressionAttributeValues: {
                ":rangeStart": rangeStart,
                ":rangeEnd": rangeEnd,
                ":userID": userID,
            }
        };

        let queryData = [];

        documentClient.query(params, onQuery);

        function onQuery(err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                reject(err);
            } else {
                // successful response
                // add each returned item to our array
                data.Items.forEach((item) => queryData.push(item));
                // check if any more items exists
                if (typeof data.LastEvaluatedKey != "undefined") {
                    params.ExclusiveStartKey = data.LastEvaluatedKey;
                    // run the query again from the lastEvaluatedKey
                    documentClient.query(params, onQuery);
                } else {
                    // No more data to be fetched, we can resolve with our results
                    resolve(queryData);
                }
            }
        }

    });
}

//============================================================================================================
