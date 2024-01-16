'use strict';
const initiateProcessing = require("./initiateProcessing.js");


exports.handler = async function(event) {

   for (const record of event.Records) {
        // Kinesis data is base64 encoded so decode here
        const payload = Buffer.from(record.kinesis.data, 'base64').toString('ascii');
        // function call for data processing
        await initiateProcessing(payload);
    }

};


