// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const config = require('../config.json');

class Publisher {

    constructor(config){
        if (config) {
            AWS.config.update(config);
        }
    }

    publish (data) {
        console.log("Publishing to SNS topic:", JSON.stringify(data));


        // Create publish parameters
        var params = {
            Message: data, /* required */
            TopicArn: config.sns_arn
        };

        // Create promise and SNS service object
        var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

        // Handle promise's fulfilled/rejected states
        publishTextPromise.then(
            function(data) {
                console.log(`Message ${params.Message} send sent to the topic ${params.TopicArn}`);
                console.log("MessageID is " + data.MessageId);
            }).catch(
            function(err) {
                console.error(err, err.stack);
            });


    };
}

module.exports = Publisher;



