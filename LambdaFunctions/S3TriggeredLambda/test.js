const aws4 = require('aws4');
const nock = require('nock');
const AWS = require('aws-sdk');

const mockEvent = {
  "Records": [
    {
      "eventID": "e463262a-6e42-11e9-9aa2-13d79a06664f",
      "eventName": "ObjectCreated:Put",
      "s3": {
        "bucket": {
          "name": "docuverify143516-dev", // Replace with your actual bucket name
          "ownerIdentity": {
            "principalId": "EXAMPLE"
          },
          "arn": "arn:aws:s3:::docuverify143516-dev"
        },
        "object": {
          "key": "public/154010ab-6bad-44a5-9d52-edfcf1a3e971_decodedoutput.pdf", // Replace with your actual object key
          "size": 1024,
          "eTag": "0123456789abcdef0123456789abcdef",
          "sequencer": "000000000000000001"
        }
      },
      "responseElements": {
        "x-amz-request-id": "0AA12345-BB67-8CDE-9F01-234567890ABC",
        "x-amz-id-2": "0AA12345-BB67-8CDE-9F01-234567890ABC"
      },
      "awsRegion": "us-east-1",
      "eventSource": "aws:s3"
    }
  ]
};

// Call the Lambda function with the mock event
const lambda = require('./app');
lambda.handler(mockEvent);
