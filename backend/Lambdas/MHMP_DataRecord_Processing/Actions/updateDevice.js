const AWS = require('aws-sdk');
const appsync = require('aws-appsync');
const { AUTH_TYPE } = require('aws-appsync-auth-link');
const gql = require('graphql-tag');
require('cross-fetch/polyfill');

/*
*   Description: Updates a given device's fields
*   Required Inputs: deviceID, ONE OF: [{deviceStatus, lastLocation}, {lastHeartRate}]
*   Expected Output: No return value. Updates both deviceStatus and lastLocation OR lastHeartRate.
 */
const updateDevice = async (data) => {
    return new Promise(function(resolve, reject) {

        const { id, deviceStatus, lastLocation, lastHeartRate } = data;

        const graphqlClient = new appsync.AWSAppSyncClient({
            url: process.env.GRAPHQL_ENDPOINT,
            region: process.env.AWS_REGION,
            auth: {
                type: AUTH_TYPE.AWS_IAM,
                credentials: AWS.config.credentials,
            },
            disableOffline: true
        });

        const mutation = gql`mutation updateDevice($input: UpdateDeviceInput!) {
            updateDevice(input: $input) {
                createdAt
                deviceOS
                deviceStatus
                id
                lastHeartRate
                updatedAt
                userID
                lastLocation {
                    lat
                    lng
                }
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
            }
        }`;

        // if lastLocation is not null, we are only updating the device's lastLocation and
        // the device status
        if (lastLocation) {
            graphqlClient.mutate({
                mutation,
                variables: {
                    input: {
                        id: id,
                        deviceStatus: deviceStatus,
                        lastLocation: lastLocation
                    }
                }
            }).then(data => {
                resolve();
            }).catch(err => {
                console.log("Error updating device lastLocation and deviceStatus: ", err);
                reject("Error updating device location and status: ", err);
            });

        } else {
            // we are only updating the device's lastHeartRate and potentially status
            graphqlClient.mutate({
                mutation,
                variables: {
                    input: {
                        id: id,
                        deviceStatus: deviceStatus,
                        lastHeartRate: lastHeartRate
                    }
                }
            }).then(data => {
                resolve();
            }).catch(err => {
                console.log("Error updating device lastHeartRate: ", err);
                reject("Error updating device lastHeartRate: ", err);
            });
        }

    });


}

module.exports = updateDevice;