const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

/*
*   Description: Saves the observed data into DynamoDB temporarily
*   Required Inputs: deviceID, userID, observationType, createdAt,
*                    AND one of: [{location}, {observationUnit, observationValue}]
*   Expected Output: No return value. Adds observation entry to DynamoDB "Data" table.
 */
const dumpData = async (data) => {
    return new Promise(function(resolve, reject) {

        // Extract the relevant fields from the payload
        const { deviceID, userID, location, observationType, observationUnit, observationValue, createdAt} = data;


        // Initialize the DynamoDB DocumentClient
        const documentClient = new AWS.DynamoDB.DocumentClient({region: process.env.AWS_REGION});
        let params = {
            TableName: process.env.DATA_TABLE,
            Item: {
                id: uuidv4(),
                deviceID: deviceID,
                userID: userID,
                createdAt: createdAt,
                observationType: observationType,
                "observationType#createdAt": observationType.concat("#").concat(createdAt),
                expirationTime: Math.floor(new Date().getTime()/1000.0)+3600, //TTL: expire after an hour
                updatedAt: new Date().toISOString(),
            }
        }

        // Set params based on observationType
        switch (observationType) {
            case "location": { // example of observationType specific data storage
                params.Item.observationType = observationType;
                params.Item.location = location;
                break;
            }
            default: {
                // heart_rate observation
                params.Item.observationType = observationType;
                params.Item.observationUnit = observationUnit;
                params.Item.observationValue = observationValue;
                break;
            }
        }

        documentClient.put(params, function(err, data) {
            if (err) {
                console.log("Error: A problem occurred saving observation data: ", err);
                reject(err);
            }
            else {
                resolve();
            }
        });

    });

}

module.exports = dumpData;