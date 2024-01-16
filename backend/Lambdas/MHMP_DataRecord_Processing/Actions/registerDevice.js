const AWS = require('aws-sdk');
const appsync = require('aws-appsync');
const { AUTH_TYPE } = require('aws-appsync-auth-link');
const gql = require('graphql-tag');
require('cross-fetch/polyfill');

/*
*   Description: Saves the Device into Device Table (DynamoDB)
*   Required Inputs: deviceID, deviceOS
*   Expected Output: No return value. Adds device entry to DynamoDB "Device" table.
 */
const registerDevice = async (device) => {
    return new Promise(function(resolve, reject) {

        // Extract the relevant fields from the payload
        const { deviceID, deviceOS} = device;

        const graphqlClient = new appsync.AWSAppSyncClient({
            url: process.env.GRAPHQL_ENDPOINT,
            region: process.env.AWS_REGION,
            auth: {
                type: AUTH_TYPE.AWS_IAM,
                credentials: AWS.config.credentials,
            },
            disableOffline: true
        });

        const mutation = gql`mutation createDevice($input: CreateDeviceInput!) {
            createDevice(input: $input) {
                createdAt
                deviceOS
                deviceStatus
                geofence {
                    boundary {
                        lat
                        lng
                    }
                    createdAt
                    id
                    locationName
                    updatedAt
                }
                id
                lastHeartRate
                lastLocation {
                    lat
                    lng
                }
                updatedAt
                userID
            }
        }`;

            graphqlClient.mutate({
                mutation,
                variables: {
                    input: {
                        id: deviceID,
                        deviceOS: deviceOS,
                        deviceStatus: "Ready",
                    }
                }
            }).then(data => {
                resolve();
            }).catch(err => {
                console.log("Error registering new device: ", err);
                reject("Error registering new device: ", err);
            });


    });

}

module.exports = registerDevice;