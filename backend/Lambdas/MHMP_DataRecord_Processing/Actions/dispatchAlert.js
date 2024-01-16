const AWS = require('aws-sdk');
const appsync = require('aws-appsync');
const { AUTH_TYPE } = require('aws-appsync-auth-link');
const gql = require('graphql-tag');
require('cross-fetch/polyfill');

/*
*   Description: Creates an Alert in DynamoDB when triggered by an anomaly detection.
*   Required Inputs: userID, type, description, location, createdAt
*   Expected Output: No return value.
 */
const dispatchAlert = async (alertData) => {
    return new Promise(function(resolve, reject) {

        const {userID, type, description, location, createdAt} = alertData;

        const graphqlClient = new appsync.AWSAppSyncClient({
            url: process.env.GRAPHQL_ENDPOINT,
            region: process.env.AWS_REGION,
            auth: {
                type: AUTH_TYPE.AWS_IAM,
                credentials: AWS.config.credentials,
            },
            disableOffline: true
        });

        const mutation = gql`mutation createAlert($input: CreateAlertInput!) {
            createAlert(input: $input) {
                createdAt
                description
                userID
                type
                id
                location {
                    lat
                    lng
                }
                expirationTime
                updatedAt
            }
        }`;
        graphqlClient.mutate({
            mutation,
            variables: {
                input: {
                    userID: userID,
                    type: type,
                    description: description,
                    location: location,
                    createdAt: createdAt,
                    expirationTime: Math.floor(new Date().getTime()/1000.0)+604800 //TTL: expire after a week
                }
            }
        }).then(data => {
            resolve();
        }).catch(err => {
            console.log("Error generating new alert: ", err);
            reject("Error generating new alert: ", err);
        });

    });
}

module.exports = dispatchAlert;